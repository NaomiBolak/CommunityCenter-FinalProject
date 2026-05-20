namespace CommunityCenter.Application.Interfaces
{
    public interface ILoggerService
    {
        Task Info(string message);

        Task Warning(string message);

        Task Error(string message);
    }
}