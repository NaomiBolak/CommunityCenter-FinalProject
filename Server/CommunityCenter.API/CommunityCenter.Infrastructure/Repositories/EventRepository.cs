using CommunityCenter.Application.Interfaces;
using CommunityCenter.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace CommunityCenter.Infrastructure.Repositories
{
    public class EventRepository: IEventRepository

    {
        private readonly DataContext? _context;

        public EventRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Event> AddEvent(Event ev)
        {
            await _context.Events.AddAsync(ev);
            await _context.SaveChangesAsync();
            return ev;
        }

        public async Task<List<Event>> GetAllEvents()
        {
            return await _context.Events.ToListAsync();
        }

        public async Task<List<Event>> GetAllEventsAsync()
        {
            return await _context.Events.ToListAsync();
        }

        public async Task<Event> GetEventById(int id)
        {
            return await _context.Events.FindAsync(id);      
        }

        public async Task<List<Event>> GetXNextEvent(int x)
        {
            return await _context.Events
        .Where(e => e.Date >= DateTime.Now) 
        .OrderBy(e => e.Date)             
        .Take(x)                           
        .ToListAsync();
        }

        public async Task <bool> RemoveEvent(int id)
        {
            var eventToDelete = await _context.Events.FindAsync(id);
            if (eventToDelete == null)
            {
                return false;
            }
            _context.Events.Remove(eventToDelete);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<Event> UpdateEvent(int id, Event ev)
        {
            var existingEvent = await _context.Events.FindAsync(id);

            if (existingEvent != null)
            {
                existingEvent.Description = ev.Description;
                existingEvent.UnitPrice = ev.UnitPrice;
                existingEvent.Date = ev.Date;
                existingEvent.MaxPlaces = ev.MaxPlaces;
                existingEvent.StartTime = ev.StartTime;
                existingEvent.EndTime = ev.EndTime;
                existingEvent.LocationId = ev.LocationId;
                existingEvent.CategoryId = ev.CategoryId;
                existingEvent.TargetAudienceId = ev.TargetAudienceId;

                await _context.SaveChangesAsync();
            }
            return existingEvent;
        }
    }
}
