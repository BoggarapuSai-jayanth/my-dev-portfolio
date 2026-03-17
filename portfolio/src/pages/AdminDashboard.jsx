import { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  LogOut, Save, LayoutDashboard, Plus, Trash2, Upload,
  User, Briefcase, Code2, BookOpen, Award, GraduationCap,
  FileText, ExternalLink, ChevronRight, Menu, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const NAV_SECTIONS = [
  { id: 'hero',           label: 'Hero',           icon: User,           color: '#6366f1' },
  { id: 'about',          label: 'About',          icon: FileText,        color: '#8b5cf6' },
  { id: 'skills',         label: 'Skills',         icon: Code2,           color: '#0ea5e9' },
  { id: 'projects',       label: 'Projects',       icon: Briefcase,       color: '#10b981' },
  { id: 'internships',    label: 'Internships',    icon: Briefcase,       color: '#f59e0b' },
  { id: 'training',       label: 'Training',       icon: BookOpen,        color: '#ef4444' },
  { id: 'education',      label: 'Education',      icon: GraduationCap,   color: '#06b6d4' },
  { id: 'certifications', label: 'Certifications', icon: Award,           color: '#f97316' },
  { id: 'achievements',   label: 'Achievements',   icon: Award,           color: '#a855f7' },
];

// ── Reusable primitives ─────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-shadow';

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={inputCls} />;
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`${inputCls} resize-y min-h-[${rows * 28}px]`}
    />
  );
}

function FileInput({ onChange, accept, label }) {
  return (
    <input
      type="file"
      accept={accept}
      onChange={onChange}
      aria-label={label}
      className={
        'flex w-full rounded-lg border border-input bg-background text-sm shadow-sm cursor-pointer ' +
        'file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:px-3 file:py-2 file:mr-3 ' +
        'hover:file:bg-primary/20 transition-colors'
      }
    />
  );
}

function SectionCard({ id, label, icon: Icon, color, children }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div
        className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
        style={{ '--section-color': color }}
      >
        {/* Colored top accent bar */}
        <div className="h-1 w-full" style={{ background: color }} />

        <div className="p-6 md:p-8">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${color}22` }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">{label}</h2>
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}

function ItemCard({ children, onDelete }) {
  return (
    <div className="relative group p-5 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-colors space-y-4">
      <button
        onClick={onDelete}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-destructive hover:bg-destructive/10"
        title="Delete"
      >
        <Trash2 size={15} />
      </button>
      {children}
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────────────────

export function AdminDashboard() {
  const { user, logout, portfolioData, updatePortfolio } = usePortfolio();
  const navigate = useNavigate();

  const [formData, setFormData]     = useState(null);
  const [isSaving, setIsSaving]     = useState(false);
  const [activeSection, setActive]  = useState('hero');
  const [sidebarOpen, setSidebar]   = useState(false);

  useEffect(() => {
    if (portfolioData) {
      setFormData(JSON.parse(JSON.stringify(portfolioData)));
    }
  }, [portfolioData]);

  if (!user) return <Navigate to="/login" replace />;
  if (!formData) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
    </div>
  );

  // ── Helpers ──────────────────────────────────────────────────────────────

  const patch = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  const patchObj = (key, sub) => setFormData(prev => ({ ...prev, [key]: { ...prev[key], ...sub } }));
  const patchArr = (key, arr) => patch(key, arr);
  const cloneArr = key => [...(formData[key] || [])];

  const handleSave = async () => {
    setIsSaving(true);
    await updatePortfolio(formData);
    setIsSaving(false);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const handleFileUpload = async (e, idx, sectionType, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) return toast.error('Invalid file type. Use PDF or image.');
    if (file.size > 5 * 1024 * 1024) return toast.error('File must be < 5 MB.');

    const fd = new FormData();
    fd.append('file', file);

    try {
      toast.loading('Uploading…', { id: 'up' });
      const { data } = await axios.post(
        'http://localhost:5000/api/upload',
        fd,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (idx === null) {
        patchObj(sectionType, { [fieldName]: data.fileUrl });
      } else {
        const arr = cloneArr(sectionType);
        arr[idx] = { ...arr[idx], [fieldName]: data.fileUrl };
        patchArr(sectionType, arr);
      }
      toast.success('Uploaded!', { id: 'up' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed', { id: 'up' });
    }
  };

  const scrollTo = (id) => {
    setActive(id);
    setSidebar(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const imgSrc = (path) =>
    path?.startsWith('/uploads') ? `http://localhost:5000${path}` : path;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-secondary/20 flex flex-col">

      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="h-16 px-4 md:px-6 flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setSidebar(o => !o)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="p-2 bg-primary/10 rounded-xl">
              <LayoutDashboard className="text-primary w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">
              Admin<span className="text-primary">.Dashboard</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/')} className="gap-2 hidden sm:flex">
              <ExternalLink size={14} /> Live Site
            </Button>
            <Button onClick={handleSave} disabled={isSaving} size="sm" className="gap-2">
              <Save size={14} />
              {isSaving ? 'Saving…' : 'Save Changes'}
            </Button>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-xl mx-auto w-full">

        {/* ── Sidebar ────────────────────────────────────────────────────── */}
        <>
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/40 md:hidden"
              onClick={() => setSidebar(false)}
            />
          )}

          <aside className={
            `fixed md:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 shrink-0 ` +
            `bg-background border-r border-border flex flex-col py-6 px-4 ` +
            `overflow-y-auto transition-transform duration-300 ` +
            `${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`
          }>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-2">
              Sections
            </p>
            <nav className="space-y-0.5">
              {NAV_SECTIONS.map(({ id, label, icon: Icon, color }) => {
                const active = activeSection === id;
                return (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={
                      `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ` +
                      (active
                        ? 'text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50')
                    }
                    style={active ? { background: `${color}18`, color } : {}}
                  >
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${color}22` }}
                    >
                      <Icon size={15} style={{ color }} />
                    </span>
                    <span className="flex-1 text-left">{label}</span>
                    {active && <ChevronRight size={14} />}
                  </button>
                );
              })}
            </nav>
          </aside>
        </>

        {/* ── Main Content ───────────────────────────────────────────────── */}
        <main className="flex-1 px-4 md:px-8 py-8 space-y-8 min-w-0">

          {/* Page Title Bar */}
          <div className="bg-card rounded-2xl border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-tight">Portfolio Content</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Changes reflect instantly on the live site after saving.</p>
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2 shrink-0">
              <Save size={16} /> {isSaving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>

          {/* ── 1. HERO ──────────────────────────────────────────────── */}
          <SectionCard id="hero" label="Hero Section" icon={User} color="#6366f1">
            <div className="grid gap-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Greeting">
                  <TextInput
                    value={formData.hero?.greeting || ''}
                    onChange={e => patchObj('hero', { greeting: e.target.value })}
                    placeholder="Hi, I'm"
                  />
                </Field>
                <Field label="Name">
                  <TextInput
                    value={formData.hero?.name || ''}
                    onChange={e => patchObj('hero', { name: e.target.value })}
                    placeholder="Your Name"
                  />
                </Field>
              </div>

              <Field label="Short Description (Sub-heading)">
                <TextArea
                  value={formData.hero?.description || ''}
                  onChange={e => patchObj('hero', { description: e.target.value })}
                  placeholder="A brief tagline about yourself…"
                />
              </Field>

              <Field label="Hero Profile Image">
                <FileInput accept="image/*" onChange={e => handleFileUpload(e, null, 'hero', 'image')} label="Hero image" />
                {formData.hero?.image && (
                  <div className="flex items-center gap-3 mt-2 p-2 rounded-lg bg-secondary/30 border border-border w-fit">
                    <img
                      src={imgSrc(formData.hero.image)}
                      alt="Hero preview"
                      className="w-14 h-14 object-cover rounded-lg border border-border"
                    />
                    <button onClick={() => patchObj('hero', { image: '' })} className="text-xs text-destructive hover:underline">
                      Remove
                    </button>
                  </div>
                )}
              </Field>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { field: 'github',   label: 'GitHub URL',    ph: 'https://github.com/…' },
                  { field: 'linkedin', label: 'LinkedIn URL',  ph: 'https://linkedin.com/in/…' },
                  { field: 'twitter',  label: 'Twitter / X',   ph: 'https://twitter.com/…' },
                  { field: 'email',    label: 'Email Address', ph: 'you@example.com', type: 'email' },
                ].map(({ field, label, ph, type }) => (
                  <Field key={field} label={label}>
                    <TextInput
                      type={type}
                      value={formData.hero?.[field] || ''}
                      onChange={e => patchObj('hero', { [field]: e.target.value })}
                      placeholder={ph}
                    />
                  </Field>
                ))}
              </div>

              <div className="p-4 rounded-xl border border-dashed border-border bg-secondary/10 space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <Upload size={15} className="text-primary" /> Upload Resume / CV (PDF)
                </p>
                <FileInput accept="application/pdf" onChange={e => handleFileUpload(e, null, 'hero', 'resumeUrl')} label="Resume PDF" />
                {formData.hero?.resumeUrl ? (
                  <p className="text-xs text-primary">
                    ✓ Uploaded —{' '}
                    <a href={`http://localhost:5000${formData.hero.resumeUrl}`} target="_blank" rel="noreferrer" className="underline">
                      Preview / Download
                    </a>
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">No resume yet. The "Download Resume" button is hidden until a file is uploaded.</p>
                )}
              </div>
            </div>
          </SectionCard>

          {/* ── 2. ABOUT ─────────────────────────────────────────────── */}
          <SectionCard id="about" label="About Section" icon={FileText} color="#8b5cf6">
            <div className="grid gap-5">
              {['text1', 'text2', 'text3'].map((key, i) => (
                <Field key={key} label={`Paragraph ${i + 1}`}>
                  <TextArea
                    rows={4}
                    value={formData.about?.[key] || ''}
                    onChange={e => patchObj('about', { [key]: e.target.value })}
                  />
                </Field>
              ))}

              <Field label="About Profile Image">
                <FileInput accept="image/*" onChange={e => handleFileUpload(e, null, 'about', 'image')} label="About image" />
                {formData.about?.image && (
                  <div className="flex items-center gap-3 mt-2 p-2 rounded-lg bg-secondary/30 border border-border w-fit">
                    <img
                      src={imgSrc(formData.about.image)}
                      alt="About preview"
                      className="w-14 h-14 object-cover rounded-lg border border-border"
                    />
                    <button onClick={() => patchObj('about', { image: '' })} className="text-xs text-destructive hover:underline">Remove</button>
                  </div>
                )}
              </Field>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { field: 'experienceYears',  label: 'Years Experience' },
                  { field: 'projectsCompleted', label: 'Projects Completed' },
                  { field: 'satisfactionRate',  label: 'Satisfaction Rate' },
                ].map(({ field, label }) => (
                  <Field key={field} label={label}>
                    <TextInput
                      value={formData.about?.[field] || ''}
                      onChange={e => patchObj('about', { [field]: e.target.value })}
                    />
                  </Field>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* ── 3. SKILLS ────────────────────────────────────────────── */}
          <SectionCard id="skills" label="Skills Categories" icon={Code2} color="#0ea5e9">
            <div className="mb-4 flex justify-end">
              <Button
                size="sm"
                className="gap-2"
                onClick={() => patchArr('skills', [...(formData.skills || []), { title: 'New Category', items: [] }])}
              >
                <Plus size={15} /> Add Category
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {formData.skills?.map((cat, idx) => (
                <ItemCard
                  key={idx}
                  onDelete={() => {
                    const a = cloneArr('skills');
                    a.splice(idx, 1);
                    patchArr('skills', a);
                  }}
                >
                  <Field label="Category Title">
                    <TextInput
                      value={cat.title || ''}
                      onChange={e => {
                        const a = cloneArr('skills');
                        a[idx].title = e.target.value;
                        patchArr('skills', a);
                      }}
                    />
                  </Field>
                  <Field label="Skills (comma separated)">
                    <TextArea
                      rows={2}
                      value={cat.items?.join(', ') || ''}
                      onChange={e => {
                        const a = cloneArr('skills');
                        a[idx].items = e.target.value.split(',').map(s => s.trim());
                        patchArr('skills', a);
                      }}
                    />
                  </Field>
                </ItemCard>
              ))}
            </div>
          </SectionCard>

          {/* ── 4. PROJECTS ──────────────────────────────────────────── */}
          <SectionCard id="projects" label="Projects" icon={Briefcase} color="#10b981">
            <div className="mb-4 flex justify-end">
              <Button
                size="sm"
                className="gap-2"
                onClick={() => patchArr('projects', [...(formData.projects || []), { title: 'New Project', description: '', tags: [], github: '', demo: '' }])}
              >
                <Plus size={15} /> Add Project
              </Button>
            </div>
            <div className="grid gap-5">
              {formData.projects?.map((item, idx) => (
                <ItemCard
                  key={idx}
                  onDelete={() => {
                    const a = cloneArr('projects');
                    a.splice(idx, 1);
                    patchArr('projects', a);
                  }}
                >
                  <div className="grid sm:grid-cols-2 gap-4 pr-8">
                    <Field label="Project Title">
                      <TextInput
                        value={item.title || ''}
                        onChange={e => { const a = cloneArr('projects'); a[idx].title = e.target.value; patchArr('projects', a); }}
                      />
                    </Field>
                    <Field label="Tags (comma separated)">
                      <TextInput
                        value={item.tags?.join(', ') || ''}
                        onChange={e => { const a = cloneArr('projects'); a[idx].tags = e.target.value.split(',').map(s => s.trim()); patchArr('projects', a); }}
                      />
                    </Field>
                  </div>
                  <Field label="Description">
                    <TextArea
                      rows={2}
                      value={item.description || ''}
                      onChange={e => { const a = cloneArr('projects'); a[idx].description = e.target.value; patchArr('projects', a); }}
                    />
                  </Field>
                  <Field label="Project Image">
                    <FileInput accept="image/*" onChange={e => handleFileUpload(e, idx, 'projects', 'image')} label="Project image" />
                    {item.image && (
                      <div className="flex items-center gap-3 mt-2 p-2 rounded-lg bg-secondary/30 border border-border w-fit">
                        <img src={imgSrc(item.image)} alt="Project preview" className="w-16 h-12 object-cover rounded-lg border border-border" />
                        <button onClick={() => { const a = cloneArr('projects'); a[idx].image = ''; patchArr('projects', a); }} className="text-xs text-destructive hover:underline">Remove</button>
                      </div>
                    )}
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="GitHub Link">
                      <TextInput
                        value={item.github || ''}
                        onChange={e => { const a = cloneArr('projects'); a[idx].github = e.target.value; patchArr('projects', a); }}
                        placeholder="https://github.com/…"
                      />
                    </Field>
                    <Field label="Live Demo Link (Optional)">
                      <TextInput
                        value={item.demo || ''}
                        onChange={e => { const a = cloneArr('projects'); a[idx].demo = e.target.value; patchArr('projects', a); }}
                        placeholder="https://your-demo.com"
                      />
                    </Field>
                  </div>
                </ItemCard>
              ))}
            </div>
          </SectionCard>

          {/* ── 5. INTERNSHIPS ───────────────────────────────────────── */}
          <SectionCard id="internships" label="Internships" icon={Briefcase} color="#f59e0b">
            <div className="mb-4 flex justify-end">
              <Button
                size="sm"
                className="gap-2"
                onClick={() => patchArr('internships', [...(formData.internships || []), { role: 'New Role', company: '', duration: '', description: '' }])}
              >
                <Plus size={15} /> Add Internship
              </Button>
            </div>
            <div className="grid gap-4">
              {formData.internships?.map((item, idx) => (
                <ItemCard
                  key={idx}
                  onDelete={() => {
                    const a = cloneArr('internships');
                    a.splice(idx, 1);
                    patchArr('internships', a);
                  }}
                >
                  <div className="grid sm:grid-cols-3 gap-4 pr-8">
                    <Field label="Role / Position">
                      <TextInput value={item.role || ''} onChange={e => { const a = cloneArr('internships'); a[idx].role = e.target.value; patchArr('internships', a); }} />
                    </Field>
                    <Field label="Company / Organization">
                      <TextInput value={item.company || ''} onChange={e => { const a = cloneArr('internships'); a[idx].company = e.target.value; patchArr('internships', a); }} />
                    </Field>
                    <Field label="Duration">
                      <TextInput value={item.duration || ''} onChange={e => { const a = cloneArr('internships'); a[idx].duration = e.target.value; patchArr('internships', a); }} placeholder="e.g. Jun–Aug 2024" />
                    </Field>
                  </div>
                  <Field label="Description">
                    <TextArea rows={2} value={item.description || ''} onChange={e => { const a = cloneArr('internships'); a[idx].description = e.target.value; patchArr('internships', a); }} />
                  </Field>
                </ItemCard>
              ))}
            </div>
          </SectionCard>

          {/* ── 6. TRAINING ──────────────────────────────────────────── */}
          <SectionCard id="training" label="Training" icon={BookOpen} color="#ef4444">
            <div className="mb-4 flex justify-end">
              <Button
                size="sm"
                className="gap-2"
                onClick={() => patchArr('training', [...(formData.training || []), { title: 'New Training', institution: '', duration: '', description: '' }])}
              >
                <Plus size={15} /> Add Training
              </Button>
            </div>
            <div className="grid gap-4">
              {formData.training?.map((item, idx) => (
                <ItemCard
                  key={idx}
                  onDelete={() => {
                    const a = cloneArr('training');
                    a.splice(idx, 1);
                    patchArr('training', a);
                  }}
                >
                  <div className="grid sm:grid-cols-3 gap-4 pr-8">
                    <Field label="Title">
                      <TextInput value={item.title || ''} onChange={e => { const a = cloneArr('training'); a[idx].title = e.target.value; patchArr('training', a); }} />
                    </Field>
                    <Field label="Institution / Platform">
                      <TextInput value={item.institution || ''} onChange={e => { const a = cloneArr('training'); a[idx].institution = e.target.value; patchArr('training', a); }} />
                    </Field>
                    <Field label="Duration">
                      <TextInput value={item.duration || ''} onChange={e => { const a = cloneArr('training'); a[idx].duration = e.target.value; patchArr('training', a); }} />
                    </Field>
                  </div>
                  <Field label="Description">
                    <TextArea rows={2} value={item.description || ''} onChange={e => { const a = cloneArr('training'); a[idx].description = e.target.value; patchArr('training', a); }} />
                  </Field>
                  <Field label="Upload Document (PDF)">
                    <FileInput accept="application/pdf" onChange={e => handleFileUpload(e, idx, 'training', 'pdfUrl')} label="Training PDF" />
                    {item.pdfUrl && (
                      <p className="text-xs text-primary mt-1">
                        ✓ <a href={`http://localhost:5000${item.pdfUrl}`} target="_blank" rel="noreferrer" className="underline">View Uploaded PDF</a>
                      </p>
                    )}
                  </Field>
                </ItemCard>
              ))}
            </div>
          </SectionCard>

          {/* ── 7. EDUCATION ─────────────────────────────────────────── */}
          <SectionCard id="education" label="Education" icon={GraduationCap} color="#06b6d4">
            <div className="mb-4 flex justify-end">
              <Button
                size="sm"
                className="gap-2"
                onClick={() => patchArr('education', [...(formData.education || []), { degree: 'New Degree', institution: '', duration: '', status: '', cgpa: '' }])}
              >
                <Plus size={15} /> Add Education
              </Button>
            </div>
            <div className="grid gap-4">
              {formData.education?.map((item, idx) => (
                <ItemCard
                  key={idx}
                  onDelete={() => {
                    const a = cloneArr('education');
                    a.splice(idx, 1);
                    patchArr('education', a);
                  }}
                >
                  <div className="grid sm:grid-cols-3 gap-4 pr-8">
                    <Field label="Degree / Title">
                      <TextInput value={item.degree || ''} onChange={e => { const a = cloneArr('education'); a[idx].degree = e.target.value; patchArr('education', a); }} />
                    </Field>
                    <Field label="Institution">
                      <TextInput value={item.institution || ''} onChange={e => { const a = cloneArr('education'); a[idx].institution = e.target.value; patchArr('education', a); }} />
                    </Field>
                    <Field label="Duration">
                      <TextInput value={item.duration || ''} onChange={e => { const a = cloneArr('education'); a[idx].duration = e.target.value; patchArr('education', a); }} />
                    </Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Current Status">
                      <TextInput value={item.status || ''} onChange={e => { const a = cloneArr('education'); a[idx].status = e.target.value; patchArr('education', a); }} placeholder="e.g. Currently Pursuing, 3rd Year B.Tech" />
                    </Field>
                    <Field label="CGPA / Percentage">
                      <TextInput value={item.cgpa || ''} onChange={e => { const a = cloneArr('education'); a[idx].cgpa = e.target.value; patchArr('education', a); }} placeholder="e.g. 8.5 CGPA or 85%" />
                    </Field>
                  </div>
                </ItemCard>
              ))}
            </div>
          </SectionCard>

          {/* ── 8. CERTIFICATIONS ────────────────────────────────────── */}
          <SectionCard id="certifications" label="Certifications & Courses" icon={Award} color="#f97316">
            <div className="mb-4 flex justify-end">
              <Button
                size="sm"
                className="gap-2"
                onClick={() => patchArr('certifications', [...(formData.certifications || []), { title: 'New Certificate', issuer: '', date: '', link: '' }])}
              >
                <Plus size={15} /> Add Certificate
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {formData.certifications?.map((item, idx) => (
                <ItemCard
                  key={idx}
                  onDelete={() => {
                    const a = cloneArr('certifications');
                    a.splice(idx, 1);
                    patchArr('certifications', a);
                  }}
                >
                  <Field label="Certificate Title">
                    <TextInput
                      value={item.title || ''}
                      onChange={e => { const a = cloneArr('certifications'); a[idx].title = e.target.value; patchArr('certifications', a); }}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Issuer">
                      <TextInput value={item.issuer || ''} onChange={e => { const a = cloneArr('certifications'); a[idx].issuer = e.target.value; patchArr('certifications', a); }} />
                    </Field>
                    <Field label="Date">
                      <TextInput value={item.date || ''} onChange={e => { const a = cloneArr('certifications'); a[idx].date = e.target.value; patchArr('certifications', a); }} />
                    </Field>
                  </div>
                  <Field label="Credential Link">
                    <TextInput value={item.link || ''} onChange={e => { const a = cloneArr('certifications'); a[idx].link = e.target.value; patchArr('certifications', a); }} placeholder="https://…" />
                  </Field>
                  <Field label="Upload Certificate (PDF)">
                    <FileInput accept="application/pdf" onChange={e => handleFileUpload(e, idx, 'certifications', 'pdfUrl')} label="Certificate PDF" />
                    {item.pdfUrl && (
                      <p className="text-xs text-primary mt-1">
                        ✓ <a href={`http://localhost:5000${item.pdfUrl}`} target="_blank" rel="noreferrer" className="underline">View Uploaded PDF</a>
                      </p>
                    )}
                  </Field>
                </ItemCard>
              ))}
            </div>
          </SectionCard>

          {/* ── 9. ACHIEVEMENTS ──────────────────────────────────────── */}
          <SectionCard id="achievements" label="Achievements" icon={Award} color="#a855f7">
            <div className="mb-4 flex justify-end">
              <Button
                size="sm"
                className="gap-2"
                onClick={() => patchArr('achievements', [...(formData.achievements || []), { title: 'New Achievement', description: '' }])}
              >
                <Plus size={15} /> Add Achievement
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {formData.achievements?.map((item, idx) => (
                <ItemCard
                  key={idx}
                  onDelete={() => {
                    const a = cloneArr('achievements');
                    a.splice(idx, 1);
                    patchArr('achievements', a);
                  }}
                >
                  <Field label="Title">
                    <TextInput
                      value={item.title || ''}
                      onChange={e => { const a = cloneArr('achievements'); a[idx].title = e.target.value; patchArr('achievements', a); }}
                    />
                  </Field>
                  <Field label="Description">
                    <TextArea
                      rows={2}
                      value={item.description || ''}
                      onChange={e => { const a = cloneArr('achievements'); a[idx].description = e.target.value; patchArr('achievements', a); }}
                    />
                  </Field>
                </ItemCard>
              ))}
            </div>
          </SectionCard>

          {/* Bottom save bar */}
          <div className="sticky bottom-0 pb-4">
            <div className="bg-background/80 backdrop-blur-md border border-border rounded-2xl px-6 py-4 shadow-lg flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Remember to save your changes before leaving the page.
              </p>
              <Button onClick={handleSave} disabled={isSaving} className="gap-2 shrink-0">
                <Save size={16} /> {isSaving ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
