using CommunityCenter.Application.Interfaces;
using CommunityCenter.Domain.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace CommunityCenter.API.Middlewares.Handlers
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            _logger.LogError(exception, "שגיאה: {Message}", exception.Message);

            var fileLogger = httpContext.RequestServices.GetService<ILoggerService>();
            if (fileLogger != null)
            {
                await fileLogger.Error(
                    $"[{httpContext.Request.Method} {httpContext.Request.Path}] {exception.GetType().Name}: {exception.Message}");
            }

            var statusCode = StatusCodes.Status500InternalServerError;
            var message = "שגיאת שרת פנימית";

            if (exception is AppException appEx)
            {
                statusCode = appEx.StatusCode;
                message = appEx.Message;
            }
            else if (httpContext.RequestServices.GetService<IHostEnvironment>()?.IsDevelopment() == true)
            {
                message = exception.Message;
            }

            var response = new ProblemDetails
            {
                Status = statusCode,
                Title = "Error",
                Detail = message
            };
           

            httpContext.Response.StatusCode = statusCode;

            await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);

            return true;
        }
    }
}
