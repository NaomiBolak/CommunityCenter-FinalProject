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
        
        
    }
}
