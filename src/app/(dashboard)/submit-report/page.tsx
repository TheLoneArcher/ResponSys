'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, MapPin, CheckCircle2, AlertTriangle, Send } from 'lucide-react';

const SKILLS = ['medical', 'logistics', 'heavy_lifting', 'tech_support'];

export default function SubmitReportPage() {
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState('');
  const [gpsLabel, setGpsLabel] = useState('');

  const [form, setForm] = useState({
    title:          '',
    description:    '',
    severity:       'moderate' as string,
    required_skill: '' as string,
    location_label: '',
    lat:            '',
    lon:            '',
  });

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const getGps = () => {
    navigator.geolocation?.getCurrentPosition(
      pos => {
        setForm(prev => ({ ...prev, lat: pos.coords.latitude.toFixed(6), lon: pos.coords.longitude.toFixed(6) }));
        setGpsLabel('GPS acquired');
      },
      () => setError('Could not acquire GPS. Enter coordinates manually.'),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');

    const lat = parseFloat(form.lat);
    const lon = parseFloat(form.lon);

    if (isNaN(lat) || isNaN(lon)) {
      setError('Valid GPS coordinates are required.'); setLoading(false); return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { error: dbErr } = await supabase.from('need_reports').insert({
      title:          form.title,
      description:    form.description,
      severity:       form.severity,
      required_skill: form.required_skill || null,
      location:       `POINT(${lon} ${lat})`,
      location_label: form.location_label,
      submitted_by:   user?.id,
      status:         'pending',
    });

    setLoading(false);
    if (dbErr) { setError(dbErr.message); return; }

    setSuccess(true);
    setForm({ title: '', description: '', severity: 'moderate', required_skill: '', location_label: '', lat: '', lon: '' });
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-[#0A0E17] text-[#F1F5F9]">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">Submit a Report</h1>
          <p className="text-[13px] text-[#94A3B8] mt-0.5">Report an incident for dispatcher review</p>
        </div>

        {success && (
          <div className="mb-5 animate-fade-in bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-medium text-[14px]">Report submitted</p>
              <p className="text-[12px] text-emerald-400/70 mt-0.5">Dispatchers have been notified.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-5 animate-fade-in bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3 text-red-400 text-[13px] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-5 space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#94A3B8] mb-1.5">Title <span className="text-red-400">*</span></label>
              <input
                required
                value={form.title} onChange={f('title')}
                className="w-full bg-[#0A0E17] border border-[#1F2937] rounded-md px-3 py-2 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Brief description of the incident"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#94A3B8] mb-1.5">Details</label>
              <textarea
                rows={3}
                value={form.description} onChange={f('description')}
                className="w-full bg-[#0A0E17] border border-[#1F2937] rounded-md px-3 py-2 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                placeholder="Describe the situation, hazards, and immediate needs..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-[#94A3B8] mb-1.5">Severity <span className="text-red-400">*</span></label>
                <select
                  value={form.severity} onChange={f('severity')}
                  className="w-full bg-[#0A0E17] border border-[#1F2937] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="critical">Critical</option>
                  <option value="moderate">Moderate</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#94A3B8] mb-1.5">Required Skill</label>
                <select
                  value={form.required_skill} onChange={f('required_skill')}
                  className="w-full bg-[#0A0E17] border border-[#1F2937] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">None / General</option>
                  {SKILLS.map(s => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[13px] font-semibold text-white">Location <span className="text-red-400">*</span></h3>
              <button type="button" onClick={getGps} className="flex items-center gap-1.5 text-[12px] text-blue-400 hover:text-blue-300 border border-blue-500/20 bg-blue-600/10 px-3 py-1.5 rounded-md transition-colors">
                <MapPin className="w-3.5 h-3.5" /> {gpsLabel || 'Use GPS'}
              </button>
            </div>
            <input
              required
              value={form.location_label} onChange={f('location_label')}
              className="w-full bg-[#0A0E17] border border-[#1F2937] rounded-md px-3 py-2 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Street address or landmark"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={form.lat} onChange={f('lat')}
                className="bg-[#0A0E17] border border-[#1F2937] rounded-md px-3 py-2 text-sm text-white placeholder-[#64748B] font-mono focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Latitude"
              />
              <input
                value={form.lon} onChange={f('lon')}
                className="bg-[#0A0E17] border border-[#1F2937] rounded-md px-3 py-2 text-sm text-white placeholder-[#64748B] font-mono focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Longitude"
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-md text-[13px] transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Submitting...' : 'Submit report'}
          </button>
        </form>
      </div>
    </div>
  );
}
