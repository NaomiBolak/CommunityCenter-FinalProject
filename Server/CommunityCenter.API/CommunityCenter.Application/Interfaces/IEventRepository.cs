using CommunityCenter.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommunityCenter.Application.Interfaces
{
    public interface IEventRepository
    {
        Task<List<Event>> GetAllEvents(); 
        Task <Event> GetEventById(int id);
        Task<Event> AddEvent(Event ev);
        Task<bool> RemoveEvent(int id);
        Task<List<Event>> GetXNextEvent(int x);
        Task<Event> UpdateEvent(int id, Event ev);
        Task<Location> GetLocation(int id);
        Task<List<Location>> GettAllLocation();
        Task<Location> AddLocation(Location loc);
        Task<int> HowManyRegistersToEvent(int eventid);
        Task<List<Employee>> GetEmployees();
        Task<List<Category>> GetCategories();
        Task<List<TargetAudience>> GetTargetAudiences();
        Task<Employee> AddEmployee(Employee emp);
        Task<bool> RemoveEmployee(int empid);
        Task<Category> AddCategory(Category cat);
        Task<TargetAudience> AddtargetAudience(TargetAudience tar);
        Task<bool> RemoveCategory(int catid);
        Task<bool> RemoveTargetAudience(int tarid);

    }
}
