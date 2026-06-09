import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eventService from "../../services/eventService";
import { useAppSelector } from '../../store/hooks';
import PaymentForm from './PaymentForm';
import EventRegistrantsList from '../admin/EventRegistrantsList';
import { PaymentData } from '../../types';
import { ROUTES } from '../../utils/constants';
import './EventCard.css';

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
    const [newEmpData, setNewEmpData] = useState({ FirstName: "", LastName: "", Phone: "", Description: "", Role: "", CategoryId: 3 });
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

            if (locResult.status === 'fulfilled') setLocations(locResult.value.data || locResult.value);
            if (catResult.status === 'fulfilled') setCategories(catResult.value.data || catResult.value);
            if (audResult.status === 'fulfilled') setAudiences(audResult.value.data || audResult.value);
            if (empResult.status === 'fulfilled') setEmployees(empResult.value.data || empResult.value);

            const counts: Record<number, number> = {};
            await Promise.all(
                (eventsList as EventItem[]).map(async (ev: EventItem) => {
                    try {
                        const countRes = await eventService.howmanyRegisterstoEvent(ev.id);
                        counts[ev.id] = countRes.data ?? countRes;
                    } catch { counts[ev.id] = 0; }
                })
            );
            setSoldCounts(counts);
        } catch {
            setFormError("שגיאה בטעינת הנתונים — ודאי שהשרת (API) רץ על http://localhost:5051");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const getLocationName = (id: any) => {
        if (!id || id === 0) return "חסר מזהה מיקום";
        const loc = locations.find(l => Number(l.id) === Number(id));
        return loc ? (loc.description || "מיקום ללא תיאור") : `מיקום (${id}) לא נמצא`;
    };

    const getTargetAudienceName = (id: any) => {
        if (!audiences || audiences.length === 0) return "טוען...";
        const audience = audiences.find(a => Number(a.id) === Number(id));
        return audience ? (audience.description || audience.name) : `לא נמצא (ID: ${id})`;
    };

    const handleDelete = async (id: number) => {
        try {
            await eventService.removeEvent(id);
            setEvents(prev => prev.filter(ev => ev.id !== id));
            setConfirmDeleteId(null);
            setSuccessMessage("האירוע נמחק בהצלחה");
        } catch { setFormError("שגיאה במחיקה"); }
    };

    const handleSaveUpdate = async () => {
        if (!editingEvent) return;
        if (!editingEvent.description.trim()) {
            setFormError('יש להזין תיאור אירוע');
            return;
        }
        if (editingEvent.unitPrice <= 0) {
            setFormError('יש להזין מחיר אירוע חוקי');
            return;
        }
        if (editingEvent.maxPlaces <= 0) {
            setFormError('יש להזין מספר מקומות גדול מ-0');
            return;
        }
        if (!editingEvent.date) {
            setFormError('יש לבחור תאריך לאירוע');
            return;
        }
        if (!editingEvent.locationId || editingEvent.locationId === 0) {
            setFormError('יש לבחור מיקום לאירוע');
            return;
        }
        try {
            if (editingEvent.id === 0) {
                const response = await eventService.addEvent(editingEvent);
                setEvents(prev => [...prev, response.data || response]);
                setSuccessMessage("האירוע נוסף בהצלחה!");
            } else {
                await eventService.updateEvent(editingEvent.id, editingEvent);
                setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? editingEvent : ev));
                setSuccessMessage("הנתונים נשמרו בהצלחה!");
            }
            setEditingEvent(null);
            setFormError('');
        } catch (error: any) {
            setFormError(error.response?.data?.errors ? "חסרים נתונים, אנא מלאי את כל השדות" : "שגיאה בשמירה, נסי שוב");
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
        } catch (e) { console.error(e); }
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
        if (!newEmpData.FirstName || !newEmpData.LastName) { setFormError("חובה למלא שם פרטי ומשפחה"); return; }
        try {
            const response = await eventService.addemployee({ ...newEmpData, CategoryId: editingEvent?.categoryId || 1, Category: null });
            const created = response.data || response;
            setEmployees(prev => [...prev, created]);
            setEditingEvent(prev => prev ? { ...prev, employeeId: created.id } : null);
            setNewEmpData({ FirstName: "", LastName: "", Description: "", Phone: "", Role: "", CategoryId: 0 });
            setIsAddingEmployee(false);
            setSuccessMessage("עובד נוסף בהצלחה!");
        } catch { setFormError("ההוספה נכשלה, נסי שוב"); }
    };

    const handleAddNewAudience = async () => {
        if (!newAudienceName.trim()) return;
        try {
            const response = await eventService.addtargetAudience({ description: newAudienceName });
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
            if (newMax < registeredCount) { setFormError(`לא ניתן להקטין ל-${newMax} כי יש כבר ${registeredCount} רשומים!`); return; }
            setEditingEvent({ ...event, maxPlaces: newMax });
        } catch { setFormError("שגיאה בטעינת נתונים"); }
    };

    const handleAddNewEvent = () => {
        setEditingEvent({
            id: 0, description: "", unitPrice: 0, maxPlaces: 50,
            locationId: locations.length > 0 ? locations[0].id : 1,
            date: new Date().toISOString().split('T')[0],
            imagePath: "", categoryId: 1, targetAudienceId: 1, employeeId: 2, currentRegistrations: 0
        } as any);
    };

    const getRemainingPlaces = (ev: EventItem) => Math.max(0, ev.maxPlaces - (soldCounts[ev.id] ?? 0));

    const handleStartPurchase = (ev: EventItem) => {
        if (!isAuthenticated) { navigate(ROUTES.LOGIN); return; }
        setPurchasingEvent(ev);
    };

    const handlePurchase = async (quantity: number, payment: PaymentData) => {
        if (!purchasingEvent) return;
        setPaymentLoading(true);
        try {
            await eventService.registerToEvent({
                eventId: purchasingEvent.id, quantity,
                cardNumber: payment.cardNumber, cardHolder: payment.cardHolder,
                expiryDate: payment.expiryDate, cvv: payment.cvv,
            });
            setSoldCounts(prev => ({ ...prev, [purchasingEvent.id]: (prev[purchasingEvent.id] ?? 0) + quantity }));
            setSuccessMessage(`נרכשו ${quantity} כרטיסים בהצלחה!`);
            setPurchasingEvent(null);
        } catch (err) { throw err; }
        finally { setPaymentLoading(false); }
    };

    if (loading) return <div className="section-loading">טוען נתונים...</div>;

    return (
        <div className="events-page">
            <h1>האירועים הקרובים</h1>

            {successMessage && (
                <div className="alert-success">
                    {successMessage}
                    <button className="alert-close" onClick={() => setSuccessMessage('')}>✕</button>
                </div>
            )}
            {formError && (
                <div className="alert-error-bar">
                    {formError}
                    <button className="alert-close" onClick={() => setFormError('')}>✕</button>
                </div>
            )}

            {userRole === 'admin' && (
                <button className="btn-add-event" onClick={handleAddNewEvent}>הוספת אירוע חדש</button>
            )}

            {/* מודל מחיקה */}
            {confirmDeleteId !== null && (
                <>
                    <div className="modal-overlay" onClick={() => setConfirmDeleteId(null)} />
                    <div className="modal-box">
                        <h3>האם למחוק אירוע זה?</h3>
                        <div className="confirm-delete-btns">
                            <button className="btn-danger" onClick={() => handleDelete(confirmDeleteId)}>מחק בוודאי</button>
                            <button className="btn-cancel" onClick={() => setConfirmDeleteId(null)}>ביטול</button>
                        </div>
                    </div>
                </>
            )}

            {/* מודל עריכה */}
            {editingEvent && (
                <>
                    <div className="modal-overlay" onClick={() => setEditingEvent(null)} />
                    <div className="modal-box">
                        <h2>{editingEvent.id === 0 ? "הוספת אירוע חדש" : "עריכת אירוע"}</h2>
                        <div className="edit-form">
                            <div>
                                <label>ניתוב תמונה</label>
                                <input type="text" placeholder="הדביקי לינק לתמונה..." value={editingEvent.imagePath}
                                    onChange={e => setEditingEvent({ ...editingEvent, imagePath: e.target.value })} />
                            </div>
                            <div className="img-preview">
                                {editingEvent.imagePath
                                    ? <img src={editingEvent.imagePath} alt="Preview" />
                                    : <span>תצוגה מקדימה</span>}
                            </div>
                            <div>
                                <label>תיאור</label>
                                <input type="text" value={editingEvent.description}
                                    onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })} />
                            </div>
                            <div>
                                <label>מחיר ליחידה (₪)</label>
                                <input type="number" min={0} step={0.01} value={editingEvent.unitPrice}
                                    onChange={e => setEditingEvent({ ...editingEvent, unitPrice: Number(parseFloat(e.target.value) || 0) })} />
                            </div>
                            <div>
                                <label>מקומות מקסימליים</label>
                                <input type="number" min={1} step={1} value={editingEvent.maxPlaces}
                                    onChange={e => editingEvent.id === 0
                                        ? setEditingEvent({ ...editingEvent, maxPlaces: Number(e.target.value) })
                                        : changemaxPlaces(editingEvent, Number(e.target.value))} />
                            </div>

                            <div>
                                <label>תאריך אירוע</label>
                                <input type="date" value={editingEvent.date}
                                    onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                            </div>
                            <div>
                                <label>מיקום</label>
                                <div className="field-with-add">
                                    <select value={editingEvent.locationId} onChange={e => setEditingEvent({ ...editingEvent, locationId: Number(e.target.value) })}>
                                        <option value={0}>בחר מיקום...</option>
                                        {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.description}</option>)}
                                    </select>
                                    <button type="button" className="btn-add-inline" onClick={() => setIsAddingLocation(!isAddingLocation)}>הוסף</button>
                                </div>
                                {isAddingLocation && (
                                    <div className="inline-add-row">
                                        <input placeholder="מיקום חדש..." value={newLocationName} onChange={e => setNewLocationName(e.target.value)} />
                                        <button className="btn-confirm-add" onClick={handleAddNewLocation}>הוסף</button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label>קטגוריה</label>
                                <div className="field-with-add">
                                    <select value={editingEvent.categoryId} onChange={e => setEditingEvent({ ...editingEvent, categoryId: Number(e.target.value) })}>
                                        <option value={0}>בחר קטגוריה...</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.description || cat.name}</option>)}
                                    </select>
                                    <button type="button" className="btn-add-inline" onClick={() => setIsAddingCategory(!isAddingCategory)}>הוסף</button>
                                </div>
                                {isAddingCategory && (
                                    <div className="inline-add-row">
                                        <input placeholder="שם קטגוריה..." value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                                        <button className="btn-confirm-add" onClick={handleAddNewCategory}>הוסף</button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label>עובד אחראי</label>
                                <div className="field-with-add">
                                    <select value={editingEvent.employeeId} onChange={e => setEditingEvent({ ...editingEvent, employeeId: Number(e.target.value) })}>
                                        <option value={0}>בחר עובד...</option>
                                        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name || emp.firstName}</option>)}
                                    </select>
                                    <button type="button" className="btn-add-inline" onClick={() => setIsAddingEmployee(!isAddingEmployee)}>הוסף</button>
                                </div>
                                {isAddingEmployee && (
                                    <div className="inline-add-row">
                                        <input placeholder="שם פרטי..." value={newEmpData.FirstName} onChange={e => setNewEmpData({ ...newEmpData, FirstName: e.target.value })} />
                                        <input placeholder="שם משפחה..." value={newEmpData.LastName} onChange={e => setNewEmpData({ ...newEmpData, LastName: e.target.value })} />
                                        <input placeholder="תפקיד..." value={newEmpData.Role} onChange={e => setNewEmpData({ ...newEmpData, Role: e.target.value })} />
                                        <button className="btn-confirm-add" onClick={handleAddNewEmployee}>הוסף</button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label>קהל יעד</label>
                                <div className="field-with-add">
                                    <select value={editingEvent.targetAudienceId} onChange={e => setEditingEvent({ ...editingEvent, targetAudienceId: Number(e.target.value) })}>
                                        <option value={0}>בחר קהל יעד...</option>
                                        {audiences.map(aud => <option key={aud.id} value={aud.id}>{aud.description || aud.name}</option>)}
                                    </select>
                                    <button type="button" className="btn-add-inline" onClick={() => setIsAddingAudience(!isAddingAudience)}>הוסף</button>
                                </div>
                                {isAddingAudience && (
                                    <div className="inline-add-row">
                                        <input placeholder="קהל יעד חדש..." value={newAudienceName} onChange={e => setNewAudienceName(e.target.value)} />
                                        <button className="btn-confirm-add" onClick={handleAddNewAudience}>הוסף</button>
                                    </div>
                                )}
                            </div>

                            {formError && <p className="alert-error">{formError}</p>}

                            <div className="modal-actions">
                                <button className="btn-save" onClick={handleSaveUpdate}>שמור ✅</button>
                                <button className="btn-cancel" onClick={() => { setEditingEvent(null); setIsAddingLocation(false); setFormError(''); }}>ביטול ❌</button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* מודל תשלום */}
            {purchasingEvent && (
                <>
                    <div className="modal-overlay" onClick={() => setPurchasingEvent(null)} />
                    <div className="modal-box">
                        <PaymentForm
                            eventDescription={purchasingEvent.description}
                            unitPrice={purchasingEvent.unitPrice}
                            maxQuantity={getRemainingPlaces(purchasingEvent)}
                            onSubmit={handlePurchase}
                            onCancel={() => setPurchasingEvent(null)}
                            loading={paymentLoading}
                        />
                    </div>
                </>
            )}

            {/* מודל נרשמים */}
            {viewRegistrantsEvent && (
                <>
                    <div className="modal-overlay" onClick={() => setViewRegistrantsEvent(null)} />
                    <div className="modal-box wide">
                        <EventRegistrantsList eventId={viewRegistrantsEvent.id} eventName={viewRegistrantsEvent.description} />
                        <button className="btn-cancel" style={{ marginTop: '12px', width: '100%' }} onClick={() => setViewRegistrantsEvent(null)}>סגור</button>
                    </div>
                </>
            )}

            {/* רשת כרטיסים */}
            <div className="events-grid">
                {events.map(ev => {
                    const remaining = getRemainingPlaces(ev);
                    return (
                        <div key={ev.id} className="event-card">
                            <div className="event-card-image">
                                {ev.imagePath && ev.imagePath !== "string"
                                    ? <img src={ev.imagePath} alt={ev.description} />
                                    : <span className="event-card-no-image">אין תמונה</span>}
                            </div>
                            <div className="event-card-body">
                                <h3>{ev.description}</h3>
                                <div className="event-meta">
                                    <p><strong>מחיר:</strong> {ev.unitPrice} ₪</p>
                                    <p><strong>מיקום:</strong> {getLocationName(ev.locationId)}</p>
                                    <p><strong>תאריך:</strong> {new Date(ev.date).toLocaleDateString('he-IL')}</p>
                                    <p><strong>מיועד ל:</strong> {getTargetAudienceName(ev.targetAudienceId || 3)}</p>
                                </div>
                                <div className={`event-spots${remaining === 0 ? ' sold-out' : ''}`}>
                                    {remaining === 0 ? 'אזלו הכרטיסים' : `${remaining} / ${ev.maxPlaces} מקומות פנויים`}
                                </div>
                                <div className="event-card-actions">
                                    {userRole === 'admin' ? (
                                        <>
                                            <div className="event-card-actions-row">
                                                <button className="btn-event edit" onClick={() => setEditingEvent(ev)}>עדכון</button>
                                                <button className="btn-event delete" onClick={() => setConfirmDeleteId(ev.id)}>מחיקה</button>
                                            </div>
                                            <button className="btn-event report" onClick={() => setViewRegistrantsEvent(ev)}>דוח נרשמים</button>
                                        </>
                                    ) : (
                                        <button
                                            className={`btn-event ${remaining > 0 ? 'buy' : 'sold-out'}`}
                                            onClick={() => handleStartPurchase(ev)}
                                            disabled={remaining === 0}
                                        >
                                            {remaining > 0 ? 'רכישת כרטיסים' : 'אזלו הכרטיסים'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EventCard;
