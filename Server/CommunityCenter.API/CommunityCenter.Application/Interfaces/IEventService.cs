using CommunityCenter.Application.DTOs;
using CommunityCenter.Domain.Entities;

namespace CommunityCenter.Application.Interfaces
{
    public interface IEventService
    {
        Task<List<Event>> GetAllEvents();
        Task<Event?> GetEventById(int id);
        Task<Event> AddEvent(Event @event);
        Task<bool> RemoveEvent(int id);
        Task<List<Event>> GetXNextEvents(int x);
        Task<Event> UpdateEvent(int id, Event ev);
        Task<Location> GetLocation(int id);
        Task<List<Location>> GettAllLocation();
        Task<Location> AddLocation(Location loc);
        Task<int> HowManyRegistersToEvent(int eventid);
        Task<List<TargetAudience>> GetTargetAudiences();
        Task<List<Employee>> GetEmployees();
        Task<List<Category>> GetCategories();
        Task<Employee> AddEmployee(Employee emp);
        Task<bool> RemoveEmployee(int empid);
        Task<Category> AddCategory(Category cat);
        Task<TargetAudience> AddtargetAudience(TargetAudience tar);
        Task<bool> RemoveCategory(int catid);
        Task<bool> RemoveTargetAudience(int tarid);
        Task<EventRegistrationResultDto> RegisterToEventAsync(int userId, EventRegistrationRequestDto dto);
        Task<List<EventRegistrantDto>> GetEventRegistrantsAsync(int eventId);
    }
}
