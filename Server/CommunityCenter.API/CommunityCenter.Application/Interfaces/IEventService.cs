using CommunityCenter.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommunityCenter.Application.Interfaces
{
    public interface IEventService
    {
        public Task<List<Event>> GetAllEvents();
        public Task<Event> AddEvent ( Event @event);
        public Task<bool> RemoveEvent (int id);
        public Task<bool> GetEventById(int  id);
        public Task<List<Event>> GetXNextEvents(int X);
        public Task<Event> UpdateEvent(int id, Event ev);
        public Task<Location> GetLocation(int id);
        public Task<List<Location>> GettAllLocation();
        public Task<Location> AddLocation(Location loc);
        public Task<int> HowManyRegistersToEvent(int eventid);
        public Task<List<TargetAudience>> GetTargetAudiences();
        public Task<List<Employee>> GetEmployees();
        public Task<List<Category>> GetCategories();
        public Task<Employee> AddEmployee(Employee emp);
        public Task<bool> RemoveEmployee(int empid);
        public Task<Category> AddCategory(Category cat);
        public Task<TargetAudience> AddtargetAudience(TargetAudience tar);
        public Task<bool> RemoveCategory(int catid);
        public Task<bool> RemoveTargetAudience(int tarid);


    }
}
