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

    }
}
