import React, { useEffect, useState } from 'react';
import eventService from "../../services/eventService";
import { useSelector } from 'react-redux';

type UserRole = 'admin' | 'user';

interface EventItem {
    id: number;
    description: string;
    unitPrice: number;
    maxPlaces: number;
    locationId: number;
    date: string;
    imagePath: string;
    // שדות נוספים שהשרת דורש כדי למנוע שגיאה 400
    categoryId?: number;
    targetAudienceId?: number;
    employeeId?: number;
    currentRegistrations?: number;
}

interface LocationItem {
    id: number;
    description: string;
}

const EventCard = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [locations, setLocations] = useState<LocationItem[]>([]);
    const userFromRedux = useSelector((state: any) => state.auth?.user);
    const userFromStorage = JSON.parse(localStorage.getItem('user') || 'null');

    const user = userFromRedux || userFromStorage;
    const userRole = user?.role?.toLowerCase() === 'admin' ? 'admin' : 'user';

    const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
    const [isAddingLocation, setIsAddingLocation] = useState(false);
    const [newLocationName, setNewLocationName] = useState("");

    const fetchData = async () => {
        try {
            const eventResponse = await eventService.getEvents();
            const extractedEvents = eventResponse.data || eventResponse;
            setEvents(Array.isArray(extractedEvents) ? extractedEvents : []);

            const locResponse = await eventService.getLocations();
            const extractedLocs = locResponse.data || locResponse;
            setLocations(Array.isArray(extractedLocs) ? extractedLocs : []);
        } catch (error) {
            console.error("שגיאה בטעינת נתונים:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getLocationName = (id: any) => {
        if (!id || id === 0) return "חסר מזהה מיקום";
        const loc = locations.find(l => Number(l.id) === Number(id));
        return loc ? (loc.description || "מיקום ללא תיאור") : `מיקום (${id}) לא נמצא`; 
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("האם את בטוחה שברצונך למחוק אירוע זה?")) {
            try {
                await eventService.removeEvent(id);
                setEvents(prev => prev.filter(ev => ev.id !== id));
            } catch (error) {
                console.error("שגיאה במחיקה:", error);
            }
        }
    };

const handleSaveUpdate = async () => {
    if (!editingEvent) return;
    try {
        if (editingEvent.id === 0) {
            const response = await eventService.addEvent(editingEvent);
            const createdEvent = response.data || response;
            setEvents(prev => [...prev, createdEvent]);
            alert("האירוע נוסף בהצלחה!");
        } else {
            await eventService.updateEvent(editingEvent.id, editingEvent);
            setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? editingEvent : ev));
            alert("הנתונים נשמרו בהצלחה!");
        }
        setEditingEvent(null);
    } catch (error: any) {
        // כאן השינוי החשוב!
        console.error("פרטי השגיאה מהשרת:", error.response?.data || error.message);
        
        // בודק אם השרת שלח פירוט על שדות חסרים
        const serverError = error.response?.data?.errors;
        if (serverError) {
            console.log("השדות שהשרת עדיין דורש:", serverError);
            alert("השרת טוען שחסרים נתונים. בדקי את ה-Console (F12)");
        } else {
            alert("שגיאה בשמירה: " + (error.response?.data || "משהו השתבש"));
        }
    }
};
    const handleAddNewLocation = async () => {
        if (!newLocationName.trim()) return;
        try {
            const response = await eventService.addLocation({ description: newLocationName });
            const createdLoc = response.data || response;
            setLocations(prev => [...prev, createdLoc]);
            if (editingEvent) setEditingEvent({ ...editingEvent, locationId: createdLoc.id });
            setNewLocationName("");
            setIsAddingLocation(false);
        } catch (error) {
            console.error("שגיאה בשמירת מיקום:", error);
        }
    };

    const changemaxPlaces = async (event: EventItem, newMax: number) => {
        if (newMax < 0) { alert("מספר מקומות לא יכול להיות שלילי!"); return; }
        try {
            const reg = await eventService.howmanyRegisterstoEvent(event.id);
            const registeredCount = reg.data || reg;
            if (newMax < registeredCount) {
                alert(`לא ניתן להקטין ל-${newMax} כי יש כבר ${registeredCount} רשומים!`);
                return;
            }
            setEditingEvent({ ...event, maxPlaces: newMax });
        } catch (error) { console.error(error); }
    };

const handleAddNewEvent = () => {
        setEditingEvent({
            id: 0, 
            description: "",
            unitPrice: 0,
            maxPlaces: 50,
            locationId: locations.length > 0 ? locations[0].id : 1,
            date: new Date().toISOString().split('T')[0],
            imagePath: "",
            // אלו השדות שהוספתי כדי למנוע את שגיאה 400/500
            startTime: "09:00:00", 
            endTime: "10:00:00",   
            categoryId: 1,      
            targetAudienceId: 1, 
            employeeId: 2, 
            employeeId1: 2,        
            currentRegistrations: 0
        } as any);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>האירועים הקרובים</h1>
            
            {userRole === 'admin' && (
                <button 
                    onClick={handleAddNewEvent}
                    style={{ 
                        ...btnStyle, 
                        backgroundColor: '#4CAF50', 
                        marginBottom: '20px', 
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >
                    ➕ הוספת אירוע חדש
                </button>
            )}

            {editingEvent && (
                <div style={modalStyle}>
                    <h2>{editingEvent.id === 0 ? "הוספת אירוע חדש" : "עריכת אירוע"}</h2>
                    
                    <label>ניתוב תמונה:</label>
                    <input 
                        style={inputStyle} 
                        type="text" 
                        placeholder="הדביקי לינק לתמונה..."
                        value={editingEvent.imagePath} 
                        onChange={(e) => setEditingEvent({...editingEvent, imagePath: e.target.value})} 
                    />
                    
                    <div style={previewBoxStyle}>
                        {editingEvent.imagePath ? (
                            <img src={editingEvent.imagePath} alt="Preview" style={imgStyle} />
                        ) : (
                            <span style={{color: '#ccc', fontSize: '12px'}}>תצוגה מקדימה</span>
                        )}
                    </div>

                    <label>תיאור: </label>
                    <input style={inputStyle} type="text" value={editingEvent.description} 
                           onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})} />

                    <label>מחיר: </label>
                    <input style={inputStyle} type="number" value={editingEvent.unitPrice} 
                           onChange={(e) => setEditingEvent({...editingEvent, unitPrice: Number(e.target.value)})} />
                    
                    <label>מקומות מקסימליים: </label>
                    <input style={inputStyle} type="number" value={editingEvent.maxPlaces} 
                           onChange={(e) => editingEvent.id === 0 ? setEditingEvent({...editingEvent, maxPlaces: Number(e.target.value)}) : changemaxPlaces(editingEvent, Number(e.target.value))} />

                    <label>בחירת מיקום: </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <select style={inputStyle} value={editingEvent.locationId} 
                                    onChange={(e) => setEditingEvent({...editingEvent, locationId: Number(e.target.value)})}>
                                <option value={0}>בחר מיקום...</option>
                                {locations.map(loc => (
                                    <option key={loc.id} value={loc.id}>{loc.description}</option>
                                ))}
                            </select>
                            <button type="button" onClick={() => setIsAddingLocation(!isAddingLocation)}>➕</button>
                        </div>
                        
                        {/* תיבת הוספת מיקום חדש - עכשיו תופיע כשלוחצים על ה-➕ */}
                        {isAddingLocation && (
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                                <input 
                                    style={{...inputStyle, marginBottom: 0}} 
                                    placeholder="שם מיקום חדש..." 
                                    value={newLocationName} 
                                    onChange={(e) => setNewLocationName(e.target.value)}
                                />
                                <button onClick={handleAddNewLocation} style={{...btnStyle, backgroundColor: '#4CAF50'}}>הוסף</button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button onClick={handleSaveUpdate} style={{ ...btnStyle, backgroundColor: '#4CAF50' }}>שמור ✅</button>
                        <button onClick={() => { setEditingEvent(null); setIsAddingLocation(false); }} style={{ ...btnStyle, backgroundColor: '#757575' }}>ביטול ❌</button>
                    </div>
                </div>
            )}

            {editingEvent && <div style={overlayStyle} onClick={() => setEditingEvent(null)} />}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {events.map(ev => (
                    <div key={ev.id} style={cardStyle}>
                        <div style={imageContainerStyle}>
                            {ev.imagePath && ev.imagePath !== "string" ? (
                                <img src={ev.imagePath} alt={ev.description} style={imgStyle} />
                            ) : (
                                <div style={placeholderStyle}>אין תמונה</div>
                            )}
                        </div>
                        <div style={{ padding: '15px' }}>
                            <h3>{ev.description}</h3>
                            <p>מחיר: {ev.unitPrice} ₪</p>
                            <p><strong>מיקום:</strong> {getLocationName(ev.locationId)}</p>
                            {userRole === 'admin' && (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setEditingEvent(ev)} style={{ ...btnStyle, backgroundColor: '#2196F3', flex: 1 }}>עדכון ✏️</button>
                                    <button onClick={() => handleDelete(ev.id)} style={{ ...btnStyle, backgroundColor: '#f44336', flex: 1 }}>מחיקה 🗑️</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ); 
};

// עיצובים - ללא שינוי
const modalStyle: React.CSSProperties = { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '30px', border: '2px solid #2196F3', borderRadius: '12px', zIndex: 1000, width: '350px' };
const inputStyle = { display: 'block', marginBottom: '10px', width: '100%', padding: '8px' };
const btnStyle = { color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const cardStyle = { border: '1px solid #ccc', borderRadius: '8px', width: '250px', overflow: 'hidden', backgroundColor: '#fff' };
const imageContainerStyle = { width: '100%', height: '150px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const imgStyle = { width: '100%', height: '100%', objectFit: 'contain' as 'contain' };
const placeholderStyle = { color: '#aaa' };
const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 };
const previewBoxStyle = { width: '100%', height: '80px', border: '1px solid #ddd', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' };

export default EventCard;