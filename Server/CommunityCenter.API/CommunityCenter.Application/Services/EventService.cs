using CommunityCenter.Application.DTOs;
using CommunityCenter.Domain.Entities;
using CommunityCenter.Application.Interfaces;
using CommunityCenter.Application.Services;

namespace CommunityCenter.Application.Services
{
    public class EventService:IEventService
    {
        private readonly IEventRepository _eventRepository;

        private readonly ILoggerService _logger;
        public EventService(IEventRepository eventRepository, ILoggerService logger)
        {
            _eventRepository = eventRepository;
            _logger = logger;
        }
        public async Task<Event> AddEvent(Event ev)
        {
            await _eventRepository.AddEvent(ev);
             await _logger.Info($"אירוע חדש נוסף: {ev.Description} (ID: {ev.Id})");

            return ev;

        }
        public async Task<bool> RemoveEvent(int id)
        {
            var sucsess = await _eventRepository.GetEventById(id);
            if (sucsess != null)
            {
               await _logger.Info($"אירוע נמחק: {sucsess.Description} (ID: {sucsess.Id})");
                await _eventRepository.RemoveEvent(id);
                return true;
            }
            return false;
        }

        public async Task<List<Event>> GetAllEvents()
        {
            return await _eventRepository.GetAllEvents();
        }


        public Task<Event?> GetEventById(int id)
        {
            return _eventRepository.GetEventById(id);
        }

        public async Task<List<Event>> GetXNextEvents(int x)
        {
            return await _eventRepository.GetXNextEvent(x);
        }


        public async Task<EventRegistrationResultDto> RegisterToEventAsync(int userId, EventRegistrationRequestDto dto)
        {
            if (dto.Quantity < 1)
                throw new Domain.Exceptions.AppException("יש לבחור לפחות כרטיס אחד", 400);

            if (string.IsNullOrWhiteSpace(dto.CardNumber) || dto.CardNumber.Length < 4)
                throw new Domain.Exceptions.AppException("פרטי תשלום לא תקינים", 400);

            var ev = await _eventRepository.GetEventById(dto.EventId);
            if (ev == null)
                throw new Domain.Exceptions.AppException("האירוע לא נמצא", 404);

            var sold = await _eventRepository.HowManyRegistersToEvent(dto.EventId);
            var remaining = ev.MaxPlaces - sold;
            if (dto.Quantity > remaining)
                throw new Domain.Exceptions.AppException($"נותרו רק {remaining} מקומות פנויים", 400);

            var registration = new RegistrationEvent
            {
                EventId = dto.EventId,
                SubscriberId = userId,
                PlacesCount = dto.Quantity,
                RegistrationDate = DateTime.Now,
                IsPaid = true
            };

            var saved = await _eventRepository.AddEventRegistrationAsync(registration);
            ev.CurrentRegistrations = sold + dto.Quantity;
            await _eventRepository.UpdateEvent(ev.Id, ev);

            await _logger.Info($"משתמש {userId} נרשם לאירוע {dto.EventId} ({dto.Quantity} כרטיסים)");

            return new EventRegistrationResultDto
            {
                RegistrationId = saved.Id,
                EventId = ev.Id,
                EventDescription = ev.Description,
                EventDate = ev.Date,
                PlacesCount = dto.Quantity,
                TotalPrice = ev.UnitPrice * dto.Quantity,
                RegistrationDate = saved.RegistrationDate,
                IsPaid = saved.IsPaid,
                RemainingPlaces = remaining - dto.Quantity
            };
        }

        public async Task<List<EventRegistrantDto>> GetEventRegistrantsAsync(int eventId)
        {
            var registrations = await _eventRepository.GetRegistrationsByEventIdAsync(eventId);
            return registrations.Select(r => new EventRegistrantDto
            {
                RegistrationId = r.Id,
                SubscriberId = r.SubscriberId,
                FullName = $"{r.Subscriber?.FirstName} {r.Subscriber?.LastName}".Trim(),
                Email = r.Subscriber?.Email ?? string.Empty,
                Phone = r.Subscriber?.Phone ?? string.Empty,
                PlacesCount = r.PlacesCount,
                RegistrationDate = r.RegistrationDate,
                IsPaid = r.IsPaid
            }).ToList();
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
           await _logger.Info($"עובד נמחק: (ID: {empid})");
            return await _eventRepository.RemoveEmployee(empid);
        }

        public async Task<Category> AddCategory(Category cat)
        {
           await _logger.Info($"קטגוריה חדשה נוספה: {cat.Description} (ID: {cat.Id})");
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
