import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eventService from "../../services/eventService";
import { useAppSelector } from '../../store/hooks';
import PaymentForm from './PaymentForm';
import EventRegistrantsList from '../admin/EventRegistrantsList';
import { PaymentData } from '../../types';
import { ROUTES } from '../../utils/constants';

interface EventItem {
    id: number;
    description: string;
    unitPrice: number;
    maxPlaces: number;
    locationId: number;
    date: string;
    imagePath: string;
    categoryId?: number;
    targetAudienceId?: number;
    employeeId?: number;
    employeeId1?: number; 
    currentRegistrations?: number;
}

interface LocationItem {
    id: number;
    description: string;
}

const EventCard = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [locations, setLocations] = useState<LocationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [formError, setFormError] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const { isAdmin, isAuthenticated } = useAppSelector(state => state.auth);
    const userRole = isAdmin ? 'admin' : 'user';
    const navigate = useNavigate();
    const [soldCounts, setSoldCounts] = useState<Record<number, number>>({});
    const [purchasingEvent, setPurchasingEvent] = useState<EventItem | null>(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [viewRegistrantsEvent, setViewRegistrantsEvent] = useState<EventItem | null>(null);
    const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
    const [isAddingLocation, setIsAddingLocation] = useState(false);
    const [newLocationName, setNewLocationName] = useState("");
    const [categories, setCategories] = useState<any[]>([]);
    const [audiences, setAudiences] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);

const [isAddingCategory, setIsAddingCategory] = useState(false);
const [newCategoryName, setNewCategoryName] = useState("");

const [isAddingEmployee, setIsAddingEmployee] = useState(false);
const [newEmpData, setNewEmpData] = useState({
    FirstName: "",
    LastName: "",
    Phone: "",
    Description:"",
    Role: "",
    CategoryId: editingEvent?.categoryId || 3
});
const [isAddingAudience, setIsAddingAudience] = useState(false);
const [newAudienceName, setNewAudienceName] = useState("");
    

const fetchData = async () => {
    try {
        const eventResponse = await eventService.getEvents();
        const eventsList = eventResponse.data || eventResponse;
        setEvents(eventsList);

        const [locResult, catResult, audResult, empResult] = await Promise.allSettled([
            eventService.getLocations(),
            eventService.getCategories(),
            eventService.gettargetadience(),
            eventService.getEmployees(),
        ]);

        if (locResult.status === 'fulfilled') {
            setLocations(locResult.value.data || locResult.value);
        }
        if (catResult.status === 'fulfilled') {
            setCategories(catResult.value.data || catResult.value);
        }
        if (audResult.status === 'fulfilled') {
            setAudiences(audResult.value.data || audResult.value);
        }
        if (empResult.status === 'fulfilled') {
            setEmployees(empResult.value.data || empResult.value);
        }

        const metadataFailed = [locResult, catResult, audResult, empResult].some(r => r.status === 'rejected');
        if (metadataFailed) {
            setFormError('חלק מהנתונים לא נטענו — ודאי שהשרת רץ על פורט 5051 ורענני את הדף.');
        }

        const counts: Record<number, number> = {};
        await Promise.all(
          (eventsList as EventItem[]).map(async (ev: EventItem) => {
            try {
              const countRes = await eventService.howmanyRegisterstoEvent(ev.id);
              counts[ev.id] = countRes.data ?? countRes;
            } catch {
              counts[ev.id] = 0;
            }
          })
        );
        setSoldCounts(counts);
    } catch (error) {
        setFormError("שגיאה בטעינת הנתונים — ודאי שהשרת (API) רץ על http://localhost:5051");
    } finally {
        setLoading(false);
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
const getTargetAudienceName = (id: any) => {
    // 1. הגנה: אם הרשימה עדיין לא נטענה
    if (!audiences || audiences.length === 0) return "טוען...";
    
    // 2. חיפוש: המרה למספר כדי למנוע בעיות של string vs number
    const targetId = Number(id);
    const audience = audiences.find(a => Number(a.id) === targetId);
    
    // 3. החזרה: שימוש ב-description או name, ואם אין - הצגת ה-ID לדיבאג
    if (audience) return audience.description || audience.name;
    return `לא נמצא (ID: ${targetId})`; 
};
    const handleDelete = async (id: number) => {
        try {
            await eventService.removeEvent(id);
            setEvents(prev => prev.filter(ev => ev.id !== id));
            setConfirmDeleteId(null);
            setSuccessMessage("האירוע נמחק בהצלחה");
        } catch (error) {
            setFormError("שגיאה במחיקה");
        }
    };

const handleSaveUpdate = async () => {
    if (!editingEvent) return;
    try {
        if (editingEvent.id === 0) {
            const response = await eventService.addEvent(editingEvent);
            const createdEvent = response.data || response;
            setEvents(prev => [...prev, createdEvent]);
            setSuccessMessage("האירוע נוסף בהצלחה!");
        } else {
            await eventService.updateEvent(editingEvent.id, editingEvent);
            setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? editingEvent : ev));
            setSuccessMessage("הנתונים נשמרו בהצלחה!");
        }
        setEditingEvent(null);
    } catch (error: any) {
        const serverError = error.response?.data?.errors;
        setFormError(serverError ? "חסרים נתונים, אנא מלאי את כל השדות" : "שגיאה בשמירה, נסי שוב");
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
    const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
        const response = await eventService.addcategory({ description: newCategoryName });
        const created = response.data || response;
        setCategories(prev => [...prev, created]);
        setEditingEvent(prev => prev ? { ...prev, categoryId: created.id } : null);
        setNewCategoryName("");
        setIsAddingCategory(false);
    } catch (e) { console.error(e); }
};

const handleAddNewEmployee = async () => {
    if (!newEmpData.FirstName || !newEmpData.LastName) {
        setFormError("חובה למלא שם פרטי ומשפחה");
        return;
    }
    try {
        const employeeToSave = {
            ...newEmpData,
            CategoryId: editingEvent?.categoryId || newEmpData.CategoryId || 1,
            Category: null
        };
        const response = await eventService.addemployee(employeeToSave);
        const created = response.data || response;
        setEmployees(prev => [...prev, created]);
        setEditingEvent(prev => prev ? { ...prev, employeeId: created.id } : null);
        setNewEmpData({ FirstName: "", LastName: "", Description: "", Phone: "", Role: "", CategoryId: 0 });
        setIsAddingEmployee(false);
        setSuccessMessage("עובד נוסף בהצלחה!");
    } catch (e: any) {
        setFormError("ההוספה נכשלה, נסי שוב");
    }
};

const handleAddNewAudience = async () => {
    if (!newAudienceName.trim()) return;
    try {
        const response = await eventService.addtargetAudience   ({ description: newAudienceName });
        const created = response.data || response;
        setAudiences(prev => [...prev, created]);
        setEditingEvent(prev => prev ? { ...prev, targetAudienceId: created.id } : null);
        setNewAudienceName("");
        setIsAddingAudience(false);
    } catch (e) { console.error(e); }
};
    

    const changemaxPlaces = async (event: EventItem, newMax: number) => {
        if (newMax < 0) { setFormError("מספר מקומות לא יכול להיות שלילי!"); return; }
        try {
            const reg = await eventService.howmanyRegisterstoEvent(event.id);
            const registeredCount = reg.data || reg;
            if (newMax < registeredCount) {
                setFormError(`לא ניתן להקטין ל-${newMax} כי יש כבר ${registeredCount} רשומים!`);
                return;
            }
            setEditingEvent({ ...event, maxPlaces: newMax });
        } catch (error) { setFormError("שגיאה בטעינת נתונים"); }
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
            startTime: "09:00:00", 
            endTime: "10:00:00",   
            categoryId: 1,      
            targetAudienceId: 1, 
            employeeId: 2,
            currentRegistrations: 0
        } as any);
    };

    const getRemainingPlaces = (ev: EventItem) => {
        const sold = soldCounts[ev.id] ?? 0;
        return Math.max(0, ev.maxPlaces - sold);
    };

    const handleStartPurchase = (ev: EventItem) => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
            return;
        }
        setPurchasingEvent(ev);
    };

    const handlePurchase = async (quantity: number, payment: PaymentData) => {
        if (!purchasingEvent) return;
        setPaymentLoading(true);
        try {
            await eventService.registerToEvent({
                eventId: purchasingEvent.id,
                quantity,
                cardNumber: payment.cardNumber,
                cardHolder: payment.cardHolder,
                expiryDate: payment.expiryDate,
                cvv: payment.cvv,
            });
            setSoldCounts(prev => ({
                ...prev,
                [purchasingEvent.id]: (prev[purchasingEvent.id] ?? 0) + quantity,
            }));
            setSuccessMessage(`נרכשו ${quantity} כרטיסים בהצלחה!`);
            setPurchasingEvent(null);
        } catch (err) {
            throw err;
        } finally {
            setPaymentLoading(false);
        }
    };

   if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>טוען נתונים...</div>;
    return (
        <div style={{ padding: '20px' }}>
            <h1>האירועים הקרובים</h1>

            {successMessage && (
                <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '6px', marginBottom: '10px' }}>
                    {successMessage}
                    <button onClick={() => setSuccessMessage('')} style={{ float: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                </div>
            )}
            {formError && (
                <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '10px' }}>
                    {formError}
                    <button onClick={() => setFormError('')} style={{ float: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                </div>
            )}

            {confirmDeleteId !== null && (
                <div style={modalStyle}>
                    <h3>האם למחוק אירוע זה?</h3>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <button onClick={() => handleDelete(confirmDeleteId)} style={{ ...btnStyle, backgroundColor: '#f44336', flex: 1 }}>מחק בודאי</button>
                        <button onClick={() => setConfirmDeleteId(null)} style={{ ...btnStyle, backgroundColor: '#757575', flex: 1 }}>ביטול</button>
                    </div>
                </div>
            )}
            
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

        {/* --- בחירת מיקום --- */}
        <label>בחירת מיקום: </label>
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
        {isAddingLocation && (
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                <input style={{...inputStyle, marginBottom: 0}} placeholder="מיקום חדש..." value={newLocationName} onChange={(e) => setNewLocationName(e.target.value)} />
                <button onClick={handleAddNewLocation} style={{...btnStyle, backgroundColor: '#4CAF50'}}>הוסף</button>
            </div>
        )}

{/* --- קטגוריה --- */}
<label>בחירת קטגוריה: </label>
<div style={{ display: 'flex', gap: '5px' }}>
    <select style={inputStyle} value={editingEvent.categoryId} onChange={(e) => setEditingEvent({...editingEvent, categoryId: Number(e.target.value)})}>
        <option value={0}>בחר קטגוריה...</option>
        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.description || cat.name}</option>)}
    </select>
    <button type="button" onClick={() => setIsAddingCategory(!isAddingCategory)}>➕</button>
</div>
{isAddingCategory && (
    <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
        <input style={{...inputStyle, marginBottom: 0}} placeholder="שם קטגוריה..." value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
        <button onClick={handleAddNewCategory} style={{...btnStyle, backgroundColor: '#4CAF50'}}>הוסף</button>
    </div>
)}

{/* --- עובד --- */}
<label>עובד אחראי: </label>
<div style={{ display: 'flex', gap: '5px' }}>
    <select style={inputStyle} value={editingEvent.employeeId} onChange={(e) => setEditingEvent({...editingEvent, employeeId: Number(e.target.value)})}>
        <option value={0}>בחר עובד...</option>
        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name || emp.firstName}</option>)}
    </select>
    <button type="button" onClick={() => setIsAddingEmployee(!isAddingEmployee)}>➕</button>
</div>
{isAddingEmployee && (
    <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
        <input style={{...inputStyle, marginBottom: 0}} placeholder="שם עובד..." value={newEmpData.FirstName} onChange={(e) => setNewEmpData({...newEmpData, FirstName: e.target.value})} />
        <input style={{...inputStyle, marginBottom: 0}} placeholder="שם משפחה..." value={newEmpData.LastName} onChange={(e) => setNewEmpData({...newEmpData, LastName: e.target.value})} />
        <input style={{...inputStyle, marginBottom: 0}} placeholder="תיאור..." value={newEmpData.Description} onChange={(e) => setNewEmpData({...newEmpData, Description: e.target.value})} />
        <input style={{...inputStyle, marginBottom: 0}} placeholder="טלפון..." value={newEmpData.Phone} onChange={(e) => setNewEmpData({...newEmpData, Phone: e.target.value})} />
        <input style={{...inputStyle, marginBottom: 0}} placeholder="תפקיד..." value={newEmpData.Role} onChange={(e) => setNewEmpData({...newEmpData, Role: e.target.value})} />
        <button onClick={handleAddNewEmployee} style={{...btnStyle, backgroundColor: '#4CAF50'}}>הוסף</button>
    </div>
)}

{/* --- קהל יעד (עם הכפתור שהיה חסר!) --- */}
<label>קהל יעד: </label>
<div style={{ display: 'flex', gap: '5px' }}>
    <select style={inputStyle} value={editingEvent.targetAudienceId} onChange={(e) => setEditingEvent({...editingEvent, targetAudienceId: Number(e.target.value)})}>
        <option value={0}>בחר קהל יעד...</option>
        {audiences.map(aud => <option key={aud.id} value={aud.id}>{aud.description || aud.name}</option>)}
    </select>
    <button type="button" onClick={() => setIsAddingAudience(!isAddingAudience)}>➕</button>
</div>
{isAddingAudience && (
    <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
        <input style={{...inputStyle, marginBottom: 0}} placeholder="קהל יעד חדש..." value={newAudienceName} onChange={(e) => setNewAudienceName(e.target.value)} />
        <button onClick={handleAddNewAudience} style={{...btnStyle, backgroundColor: '#4CAF50'}}>הוסף</button>
    </div>
)}
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            {formError && <p style={{ color: '#c62828', fontSize: '13px', marginBottom: '8px' }}>{formError}</p>}
            <button onClick={handleSaveUpdate} style={{ ...btnStyle, backgroundColor: '#4CAF50' }}>שמור ✅</button>
            <button onClick={() => { setEditingEvent(null); setIsAddingLocation(false); setFormError(''); }} style={{ ...btnStyle, backgroundColor: '#757575' }}>ביטול ❌</button>
        </div>
    </div>
)}
            {editingEvent && <div style={overlayStyle} onClick={() => setEditingEvent(null)} />}

            {purchasingEvent && (
                <div style={modalStyle}>
                    <PaymentForm
                        eventDescription={purchasingEvent.description}
                        unitPrice={purchasingEvent.unitPrice}
                        maxQuantity={getRemainingPlaces(purchasingEvent)}
                        onSubmit={handlePurchase}
                        onCancel={() => setPurchasingEvent(null)}
                        loading={paymentLoading}
                    />
                </div>
            )}
            {purchasingEvent && <div style={overlayStyle} onClick={() => setPurchasingEvent(null)} />}

            {viewRegistrantsEvent && (
                <div style={{ ...modalStyle, width: '600px' }}>
                    <EventRegistrantsList eventId={viewRegistrantsEvent.id} eventName={viewRegistrantsEvent.description} />
                    <button onClick={() => setViewRegistrantsEvent(null)} style={{ ...btnStyle, backgroundColor: '#757575', marginTop: '12px' }}>סגור</button>
                </div>
            )}
            {viewRegistrantsEvent && <div style={overlayStyle} onClick={() => setViewRegistrantsEvent(null)} />}

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
                            <p><strong>מחיר:</strong> {ev.unitPrice} ₪</p>
                            <p><strong>מיקום:</strong> {getLocationName(ev.locationId)}</p>
                            <p><strong>תאריך:</strong> {new Date(ev.date).toLocaleDateString('he-IL')}</p>
                            <p><strong>מיועד ל:</strong> {getTargetAudienceName(ev.targetAudienceId||3)}</p>
                            <p><strong>מקומות פנויים:</strong> {getRemainingPlaces(ev)} / {ev.maxPlaces}</p>

                            {userRole === 'admin' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => setEditingEvent(ev)} style={{ ...btnStyle, backgroundColor: '#2196F3', flex: 1 }}>עדכון ✏️</button>
                                        <button onClick={() => setConfirmDeleteId(ev.id)} style={{ ...btnStyle, backgroundColor: '#f44336', flex: 1 }}>מחיקה 🗑️</button>
                                    </div>
                                    <button onClick={() => setViewRegistrantsEvent(ev)} style={{ ...btnStyle, backgroundColor: '#ff9800' }}>דוח נרשמים 📋</button>
                                </div>
                            )}

                            {userRole !== 'admin' && (
                                <button
                                    onClick={() => handleStartPurchase(ev)}
                                    disabled={getRemainingPlaces(ev) === 0}
                                    style={{
                                        ...btnStyle,
                                        backgroundColor: getRemainingPlaces(ev) > 0 ? '#4CAF50' : '#bdbdbd',
                                        width: '100%',
                                        marginTop: '8px'
                                    }}
                                >
                                    {getRemainingPlaces(ev) > 0 ? '🎟️ רכישת כרטיסים' : 'אזלו הכרטיסים'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ); 
};

// עיצובים - ללא שינוי
const modalStyle: React.CSSProperties = { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '30px', border: '2px solid #2196F3', borderRadius: '12px', zIndex: 1000, width: '350px',maxHeight: '90vh',
    overflowY: 'auto'};
const inputStyle = { display: 'block', marginBottom: '10px', width: '100%', padding: '8px' };
const btnStyle = { color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const cardStyle = { border: '1px solid #ccc', borderRadius: '8px', width: '250px', overflow: 'hidden', backgroundColor: '#fff' };
const imageContainerStyle = { width: '100%', height: '150px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const imgStyle = { width: '100%', height: '100%', objectFit: 'contain' as 'contain' };
const placeholderStyle = { color: '#aaa' };
const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 };
const previewBoxStyle = { width: '100%', height: '80px', border: '1px solid #ddd', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' };

export default EventCard;