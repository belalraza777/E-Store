import './feedbackForm.css';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../context/authContext.jsx';

export default function FeedBack() {
    const { user } = useAuth(); 
    const googleFormUrl = import.meta.env.VITE_GOOGLE_FORM_URL;
    const formRef = useRef(null); // Ref to the form element
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const form = formRef.current;
        const formData = new FormData(form);
        fetch(googleFormUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: formData,
        }).finally(() => {
            setTimeout(() => {
                toast.success('Feedback submitted! Thank you.');
                form.reset();
                setLoading(false);
                navigate('/');
            }, 800);
        });
    };

    return (
        <div className="feedback-form-container">
            <h2 className="feedback-form-title">Feedback Form</h2>
            <form
                ref={formRef}
                className="feedback-form"
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
                aria-busy={loading}
            >
                <div>
                    <label htmlFor="entry.802715601" className="feedback-form-label">Name</label>
                    <input type="text" id="entry.802715601" name="entry.802715601" required placeholder="Your name" className="feedback-form-input" 
                    value={user?.name || ''} />
                </div>
                <div>
                    <label htmlFor="entry.1224069369" className="feedback-form-label">Email</label>
                    <input type="email" id="entry.1224069369" name="entry.1224069369" required placeholder="you@example.com" className="feedback-form-input" 
                    value={user?.email || ''} />
                </div>
                <div>
                    <label htmlFor="entry.1660420853" className="feedback-form-label">Rating</label>
                    <select id="entry.1660420853" name="entry.1660420853" required className="feedback-form-select">
                        <option value="">Select rating</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="entry.1264479052" className="feedback-form-label">Feedback</label>
                    <textarea id="entry.1264479052" name="entry.1264479052" required rows={4} placeholder="Your feedback..." className="feedback-form-textarea" />
                </div>
                <button type="submit" className="feedback-form-submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}
