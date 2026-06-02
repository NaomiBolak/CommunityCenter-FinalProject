using CommunityCenter.Application.Interfaces;

namespace CommunityCenter.API.Services
{
    public class FileLoggerService : ILoggerService
    {
        private readonly string _logDirectory = "Logs";
        private static readonly SemaphoreSlim _semaphore = new(1, 1);

        public FileLoggerService()
        {
            if (!Directory.Exists(_logDirectory))
                Directory.CreateDirectory(_logDirectory);
        }

        public Task Info(string message) => WriteLog("INFO", message);
        public Task Warning(string message) => WriteLog("WARNING", message);
        public Task Error(string message) => WriteLog("ERROR", message);

        private async Task WriteLog(string level, string message)
        {
            var path = Path.Combine(_logDirectory, $"log-{DateTime.Now:yyyy-MM-dd}.txt");
            var log = $"[{DateTime.Now:HH:mm:ss}] [{level}] {message}{Environment.NewLine}";

            await _semaphore.WaitAsync();
            try
            {
                await using var stream = new FileStream(path, FileMode.Append, FileAccess.Write, FileShare.ReadWrite);
                await using var writer = new StreamWriter(stream);
                await writer.WriteAsync(log);
            }
            finally
            {
                _semaphore.Release();
            }
        }
    }
}
