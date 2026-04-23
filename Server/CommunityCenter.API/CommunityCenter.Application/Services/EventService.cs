using CommunityCenter.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CommunityCenter.Application.Interfaces;


namespace CommunityCenter.Application.Services
{
    public class EventService:IEventService
    {
        private readonly IEventRepository _eventRepository;
        public EventService(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }
        public async Task<Event> AddEvent(Event ev)
        {
            await _eventRepository.AddEvent(ev);
            return ev;

        }
        public async Task<bool> RemoveEvent(int id)
        {
            var sucsess = await _eventRepository.GetEventById(id);
            if (sucsess != null)
            {
                await _eventRepository.RemoveEvent(id);
                return true;
            }
            return false;
        }

        public async Task<List<Event>> GetAllEvents()
        {
            return await _eventRepository.GetAllEvents();
        }


        public Task<Event> GetEventById(int id)
        {
            return _eventRepository.GetEventById(id);
        }

        public async Task<List<Event>> GetXNextEvents(int x)
        {
            return await _eventRepository.GetXNextEvent(x);
        }


        Task<bool> IEventService.GetEventById(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<Event> UpdateEvent(int id, Event ev)
        {

            return await _eventRepository.UpdateEvent(id,ev);
        }

        public async Task<Location> GetLocation(int id)
        {
            return await _eventRepository.GetLocation(id);
        }

        public async Task<List<Location>> GettAllLocation()
        {
            return await _eventRepository.GettAllLocation();
        }

        public async Task<Location> AddLocation(Location loc)
        {
            return await _eventRepository.AddLocation(loc);
        }

        public async Task<int> HowManyRegistersToEvent(int eventid)
        {
            return await _eventRepository.HowManyRegistersToEvent(eventid);
        }

        public async Task<List<TargetAudience>> GetTargetAudiences()
        {
            return await _eventRepository.GetTargetAudiences();
        }

        public async Task<List<Employee>> GetEmployees()
        {
            return await _eventRepository.GetEmployees();
        }

        public async Task<List<Category>> GetCategories()
        {
            return await _eventRepository.GetCategories();
        }

        public async Task<Employee> AddEmployee(Employee emp)
        {
            return await _eventRepository.AddEmployee(emp);
        }

        public async Task<bool> RemoveEmployee(int empid)
        {
            return await _eventRepository.RemoveEmployee(empid);
        }

        public async Task<Category> AddCategory(Category cat)
        {
            return await _eventRepository.AddCategory(cat);
        }

        public async Task<TargetAudience> AddtargetAudience(TargetAudience tar)
        {
            return await _eventRepository.AddtargetAudience(tar);
        }

        public async Task<bool> RemoveCategory(int catid)
        {
            return await _eventRepository.RemoveCategory(catid);
        }

        public async Task<bool> RemoveTargetAudience(int tarid)
        {
            return await _eventRepository.RemoveTargetAudience(tarid);
        }
    }
}
