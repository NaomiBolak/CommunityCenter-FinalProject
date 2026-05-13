using CommunityCenter.API.Services;
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
            FileLoggerService logger)
        {
            var stopwatch = Stopwatch.StartNew();

            var method = context.Request.Method;
            var path = context.Request.Path;

            await logger.LogAsync(
                $"Request Started | {method} {path}");

            await _next(context);

            stopwatch.Stop();

            var statusCode = context.Response.StatusCode;

            await logger.LogAsync(
                $"Request Finished | {method} {path} | " +
                $"Status: {statusCode} | " +
                $"Time: {stopwatch.ElapsedMilliseconds}ms");
        }
    }
}