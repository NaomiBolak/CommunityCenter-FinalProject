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
    public class EventRepository : IEventRepository

    {
        private readonly DataContext? _context;

        public EventRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Event> AddEvent(Event ev)
        {
            if (ev.CategoryId == 0) ev.CategoryId = 1;
            if (ev.TargetAudienceId == 0) ev.TargetAudienceId = 1;
            if (ev.EmployeeId == 0) ev.EmployeeId = 1;

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

        public async Task<bool> RemoveEvent(int id)
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
                existingEvent.ImagePath = ev.ImagePath;

                await _context.SaveChangesAsync();
            }


            return existingEvent;
        }

        public async Task<Location> GetLocation(int id)
        {
            return await _context.Locations.FindAsync(id);
        }

        public async Task<List<Location>> GettAllLocation()
        {
            return await _context.Locations.ToListAsync();
        }

        public async Task<Location> AddLocation(Location loc)
        {
            await _context.Locations.AddAsync(loc);
            await _context.SaveChangesAsync();
            return loc;
        }

        public async Task<int> HowManyRegistersToEvent(int eventid)
        {
           return await _context.EventRegistrations
        .Where(r => r.EventId == eventid).CountAsync();
        }

        public async Task<List<Employee>> GetEmployees()
        {
            return await _context.Employees.ToListAsync();
        }
        public async Task<List<Category>> GetCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<List<TargetAudience>> GetTargetAudiences()
        {
            return await _context.TargetAudiences.ToListAsync();
        }
        public async Task<Employee> AddEmployee(Employee emp)
        {
            await _context.Employees.AddAsync(emp);
            await _context.SaveChangesAsync();

            return emp;
        }
        public async Task<bool> RemoveEmployee(int empid)
        {
            var emp = await _context.Employees.FindAsync(empid);
            if (emp ==null)
                return false;
             _context.Employees.Remove(emp);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> RemoveCategory(int catid)
        {
            var cat = await _context.Categories.FindAsync(catid);
            if (cat == null)
                return false;
            _context.Categories.Remove(cat);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> RemoveTargetAudience(int tarid)
        {
            var tar = await _context.TargetAudiences.FindAsync(tarid);
            if (tar == null)
                return false;
            _context.TargetAudiences.Remove(tar);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<Category> AddCategory(Category cat)
        {
            await _context.Categories.AddAsync(cat);
            await _context.SaveChangesAsync();

            return cat;
        }

        public async Task<TargetAudience> AddtargetAudience(TargetAudience tar)
        {
            await _context.TargetAudiences.AddAsync(tar);
            await _context.SaveChangesAsync();

            return tar;
        }



    }
}


