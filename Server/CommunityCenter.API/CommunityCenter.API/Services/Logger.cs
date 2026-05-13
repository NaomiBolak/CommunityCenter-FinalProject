using CommunityCenter.Application.Interfaces;

namespace CommunityCenter.API.Services
{
    public class FileLoggerService : ILoggerService
    {
        private readonly string _logDirectory = "Logs";

        public FileLoggerService()
        {
            if (!Directory.Exists(_logDirectory))
            {
                Directory.CreateDirectory(_logDirectory);
            }
        }

        public async Task Info(string message)
        {
            await WriteLog("INFO", message);
        }

        public async Task Warning(string message)
        {
            await WriteLog("WARNING", message);
        }

        public async Task Error(string message)
        {
            await WriteLog("ERROR", message);
        }

        private async Task WriteLog(string level, string message)
        {
            var fileName = $"log-{DateTime.Now:yyyy-MM-dd}.txt";

            var path = Path.Combine(_logDirectory, fileName);

            var log =
                $"[{DateTime.Now:HH:mm:ss}] [{level}] {message}{Environment.NewLine}";

            await File.AppendAllTextAsync(path, log);
        }
    }
}