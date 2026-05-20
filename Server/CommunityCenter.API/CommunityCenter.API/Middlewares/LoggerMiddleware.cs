using CommunityCenter.API.Services;
using CommunityCenter.Application.Interfaces;
using System.Diagnostics;

namespace CommunityCenter.API.Middleware
{
    public class LoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public LoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(
            HttpContext context,
            ILoggerService logger)
        {
            var stopwatch = Stopwatch.StartNew();

            var method = context.Request.Method;
            var path = context.Request.Path;

            await logger.Info(
                $"Request Started | {method} {path}");

            try
            {
                await _next(context);
            }
            finally
            {
                stopwatch.Stop();

                var statusCode = context.Response.StatusCode;

                await logger.Info(
                    $"Request Finished | {method} {path} | " +
                    $"Status: {statusCode} | " +
                    $"Time: {stopwatch.ElapsedMilliseconds}ms");
            }
        }
    }
}