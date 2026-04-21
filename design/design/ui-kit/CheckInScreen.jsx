// CheckInScreen — Sharper Man UI Kit
// Includes Daily Pulse quiz overlay

const PULSE_QUESTIONS = [
  {
    id: 'mood',
    type: 'mood',
    question: "How are you showing up today?",
    options: [
      { value: 'locked_in',  label: 'Locked in',  icon: '⚔' },
      { value: 'steady',     label: 'Steady',     icon: '🏔' },
      { value: 'distracted', label: 'Distracted', icon: '🌀' },
      { value: 'tired',      label: 'Tired',      icon: '🌧' },
      { value: 'struggling', label: 'Struggling', icon: '⚡' },
    ],
  },
  {
    id: 'struggled',
    type: 'grouped',
    question: "Today I struggled with…",
    subtitle: "Select all that apply — or skip",
    groups: [
      { label: 'Spiritual',  color: '#C8A84B', items: ['Doubt','Lack of prayer','Spiritual dryness','Pornography','Lust'] },
      { label: 'Mental',     color: '#4B8EC8', items: ['Anxiety','Overthinking','Negative self-talk','Comparison','Hopelessness'] },
      { label: 'Relational', color: '#7C4BC8', items: ['Anger','Pride','Conflict','Isolation','Bitterness'] },
      { label: 'Physical',   color: '#4CAF78', items: ['Laziness','Poor diet','Skipped workout','Sleep','Substance use'] },
    ],
  },
  {
    id: 'overcame',
    type: 'grouped',
    question: "Today I overcame…",
    subtitle: "Select all that apply — or skip",
    groups: [
      { label: 'Spiritual',  color: '#C8A84B', items: ['Temptation','Skipping prayer','A moment of doubt','Spiritual distraction'] },
      { label: 'Mental',     color: '#4B8EC8', items: ['Negative self-talk','Anxiety spiral','Giving up','Fear of failure'] },
      { label: 'Relational', color: '#7C4BC8', items: ['Holding a grudge','Conflict','Isolation','A hard conversation'] },
      { label: 'Physical',   color: '#4CAF78', items: ['Skipping a workout','A bad habit','Poor eating','Staying up late'] },
    ],
  },
  {
    id: 'faith',
    type: 'multiselect',
    question: "Today I…",
    subtitle: "Check everything that happened",
    options: [
      'Shared my faith with someone',
      'Encouraged a brother',
      'Prayed with or for someone by name',
      'Shared my testimony',
      'Served without recognition',
      'Let an offense go',
      'Led my family spiritually',
      'Held my tongue when I wanted to react',
      'None of these today',
    ],
  },
  {
    id: 'gratitude',
    type: 'text',
    question: "One thing I'm grateful for today…",
    placeholder: "Write anything — big or small",
  },
  {
    id: 'tomorrow',
    type: 'single',
    question: "Tomorrow I want to focus on…",
    options: [
      { value: 'prayer',      label: 'Deeper prayer time',          color: '#C8A84B' },
      { value: 'scripture',   label: 'More time in Scripture',      color: '#C8A84B' },
      { value: 'clarity',     label: 'Mental clarity & focus',      color: '#4B8EC8' },
      { value: 'brotherhood', label: 'Connecting with a brother',   color: '#4B8EC8' },
      { value: 'discipline',  label: 'Physical discipline',         color: '#7C4BC8' },
      { value: 'rest',        label: 'Rest & recovery',             color: '#7C4BC8' },
    ],
  },
];

const DailyPulse = ({ onComplete, onDismiss }) => {
  const { colors, fonts } = SM;
  const [step, setStep]       = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [textVal, setTextVal] = React.useState('');
  const [animDir, setAnimDir] = React.useState('in');

  const q = PULSE_QUESTIONS[step];
  const total = PULSE_QUESTIONS.length;
  const isLast = step === total - 1;
  const answer = answers[q.id];

  const toggleMulti = (val) => {
    setAnswers(a => {
      const cur = a[q.id] || [];
      return { ...a, [q.id]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] };
    });
  };

  const selectSingle = (val) => setAnswers(a => ({ ...a, [q.id]: val }));

  const canAdvance = () => {
    if (q.type === 'mood')   return !!answer;
    if (q.type === 'single') return !!answer;
    return true; // grouped, multiselect, text are skippable
  };

  const advance = () => {
    if (q.type === 'text') setAnswers(a => ({ ...a, [q.id]: textVal }));
    if (isLast) {
      const final = q.type === 'text' ? { ...answers, [q.id]: textVal } : answers;
      onComplete(final);
    } else {
      setAnimDir('out');
      setTimeout(() => { setStep(s => s + 1); setTextVal(''); setAnimDir('in'); }, 180);
    }
  };

  const skippable = q.type === 'grouped' || q.type === 'multiselect' || q.type === 'text';

  return (
    <div style={{ position:'absolute', inset:0, background:colors.black, zIndex:100, display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* Header */}
      <div style={{ padding:'14px 18px 0', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div>
          <div style={{ fontFamily:fonts.body, fontSize:8, fontWeight:600, letterSpacing:2, textTransform:'uppercase', color:colors.grey, marginBottom:2 }}>⚔ Daily Pulse</div>
          <div style={{ fontFamily:fonts.display, fontSize:22, fontWeight:700, color:colors.white, lineHeight:'26px' }}>
            Check-In.<br/><em style={{ color:colors.gold }}>Day 14.</em>
          </div>
        </div>
        <button onClick={onDismiss} style={{ background:'none', border:'none', cursor:'pointer', padding:6 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M13 3L3 13" stroke={colors.grey} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ padding:'12px 18px 0', display:'flex', gap:4, flexShrink:0 }}>
        {PULSE_QUESTIONS.map((_, i) => (
          <div key={i} style={{ flex:1, height:3, borderRadius:999, transition:'background .3s',
            background: i < step ? colors.gold : i === step ? colors.goldLight : colors.charcoalLight }} />
        ))}
      </div>
      <div style={{ padding:'4px 18px 0', fontFamily:fonts.mono, fontSize:8, color:colors.grey, flexShrink:0 }}>{step + 1} of {total}</div>

      {/* Question body */}
      <div style={{
        flex:1, padding:'18px 18px 0', display:'flex', flexDirection:'column', gap:14, overflowY:'auto',
        opacity: animDir === 'out' ? 0 : 1,
        transform: animDir === 'out' ? 'translateX(16px)' : 'translateX(0)',
        transition:'opacity .18s, transform .18s',
      }}>
        <div style={{ fontFamily:fonts.display, fontSize:20, fontWeight:700, color:colors.white, lineHeight:'26px' }}>{q.question}</div>
        {q.subtitle && <div style={{ fontFamily:fonts.body, fontSize:9, color:colors.grey, marginTop:-6, letterSpacing:.5 }}>{q.subtitle}</div>}

        {/* Mood tiles */}
        {q.type === 'mood' && (
          <div style={{ display:'flex', gap:7 }}>
            {q.options.map(o => {
              const active = answer === o.value;
              return (
                <button key={o.value} onClick={() => selectSingle(o.value)} style={{
                  flex:1, background: active ? colors.goldSubtle : colors.charcoal,
                  border:`1px solid ${active ? colors.goldBorder : 'rgba(255,255,255,0.06)'}`,
                  borderRadius:16, padding:'12px 4px', cursor:'pointer',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:5, transition:'all .15s',
                }}>
                  <span style={{ fontSize:17, lineHeight:1 }}>{o.icon}</span>
                  <span style={{ fontFamily:fonts.body, fontSize:8, fontWeight:600, letterSpacing:.3,
                    color: active ? colors.gold : colors.whiteMuted }}>{o.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Grouped multi-select */}
        {q.type === 'grouped' && q.groups.map(g => (
          <div key={g.label}>
            <div style={{ fontFamily:fonts.body, fontSize:8, fontWeight:600, letterSpacing:1.6, textTransform:'uppercase', color:g.color, marginBottom:7 }}>{g.label}</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {g.items.map(item => {
                const sel = (answer || []).includes(item);
                return (
                  <button key={item} onClick={() => toggleMulti(item)} style={{
                    padding:'6px 13px', borderRadius:999, cursor:'pointer', transition:'all .15s',
                    background: sel ? `rgba(${g.color.replace('#','').match(/../g).map(x=>parseInt(x,16)).join(',')},0.12)` : colors.charcoal,
                    border:`1px solid ${sel ? g.color : 'rgba(255,255,255,0.07)'}`,
                    fontFamily:fonts.body, fontSize:11, fontWeight:600,
                    color: sel ? g.color : colors.whiteDim,
                  }}>{item}</button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Flat multi-select */}
        {q.type === 'multiselect' && (
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {q.options.map(o => {
              const sel = (answer || []).includes(o);
              const isNone = o.startsWith('None');
              return (
                <button key={o} onClick={() => {
                  if (isNone) setAnswers(a => ({ ...a, [q.id]: sel ? [] : [o] }));
                  else toggleMulti(o);
                }} style={{
                  width:'100%', padding:'12px 14px', borderRadius:16, cursor:'pointer', textAlign:'left',
                  display:'flex', alignItems:'center', justifyContent:'space-between', transition:'all .15s',
                  background: sel ? colors.goldSubtle : colors.charcoal,
                  border:`1px solid ${sel ? colors.goldBorder : 'rgba(255,255,255,0.06)'}`,
                  opacity: isNone ? .7 : 1,
                }}>
                  <span style={{ fontFamily:fonts.body, fontSize:12, fontWeight:600, color: sel ? colors.gold : colors.whiteDim }}>{o}</span>
                  {sel && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" fill={colors.gold} opacity=".2"/>
                      <path d="M4 7l2 2 4-4" stroke={colors.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Single select */}
        {q.type === 'single' && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {q.options.map(o => {
              const active = answer === o.value;
              const rgb = o.color.replace('#','').match(/../g).map(x=>parseInt(x,16)).join(',');
              return (
                <button key={o.value} onClick={() => selectSingle(o.value)} style={{
                  width:'100%', padding:'14px 16px', borderRadius:18, cursor:'pointer', textAlign:'left',
                  background: active ? `rgba(${rgb},0.10)` : colors.charcoal,
                  border:`1px solid ${active ? o.color : 'rgba(255,255,255,0.06)'}`,
                  display:'flex', alignItems:'center', justifyContent:'space-between', transition:'all .15s',
                }}>
                  <span style={{ fontFamily:fonts.body, fontSize:13, fontWeight:600, color: active ? o.color : colors.whiteDim }}>{o.label}</span>
                  {active && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" fill={o.color} opacity=".2"/>
                      <path d="M4 7l2 2 4-4" stroke={o.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Text input */}
        {q.type === 'text' && (
          <div style={{ background:colors.charcoal, borderRadius:18, border:`1px solid rgba(255,255,255,0.08)`, overflow:'hidden' }}>
            <textarea value={textVal} onChange={e => setTextVal(e.target.value)} placeholder={q.placeholder} rows={5}
              style={{ width:'100%', background:'transparent', border:'none', outline:'none', resize:'none',
                padding:'14px', fontFamily:fonts.body, fontSize:13, color:colors.white, lineHeight:'20px' }} />
          </div>
        )}

        <div style={{ height:8 }} />
      </div>

      {/* CTA */}
      <div style={{ padding:'12px 18px 20px', flexShrink:0 }}>
        <button onClick={advance} style={{
          width:'100%', height:48, borderRadius:999, border:'none', cursor:'pointer', transition:'all .15s',
          background: canAdvance() ? colors.gold : colors.charcoalLight,
          fontFamily:fonts.body, fontSize:13, fontWeight:600,
          color: canAdvance() ? '#000' : colors.whiteMuted,
        }}>
          {isLast ? 'Complete Check-In' : skippable ? 'Continue' : 'Next'}
        </button>
        {skippable && (
          <div style={{ textAlign:'center', marginTop:8 }}>
            <button onClick={advance} style={{ background:'none', border:'none', fontFamily:fonts.body, fontSize:10, color:colors.grey, cursor:'pointer' }}>
              Skip this one
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CheckInScreen = () => {
  const { colors, fonts, View, ScreenHeader, Badge, ElijahBubble, UserBubble } = SM;
  const [input, setInput]     = React.useState('');
  const [showPulse, setShowPulse] = React.useState(false);
  const [pulseComplete, setPulseComplete] = React.useState(localStorage.getItem('sm_pulse_done') === 'true');
  const [messages, setMessages] = React.useState([
    { from:'elijah', text:"Good morning, Marcus. You're on day 14 — that's consistency. How did your quiet time go today?" },
    { from:'user',   text:"Got into Proverbs 27 early. That verse about iron sharpening iron really landed." },
    { from:'elijah', text:"That's one of the most powerful ones in Proverbs for brotherhood. What made it land specifically today?" },
    { from:'user',   text:"Had a hard conversation with a friend yesterday. Think God was preparing me." },
    { from:'elijah', text:"That's growth, Marcus — being able to see God's hand in hard moments. How are you feeling going into today?" },
  ]);
  const messagesEndRef = React.useRef(null);

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { from:'user', text:input.trim() }]);
    setInput('');
    setTimeout(() => setMessages(m => [...m, { from:'elijah', text:"That's worth sitting with. Keep leaning in — you're doing the work." }]), 900);
  };

  const handlePulseComplete = (answers) => {
    setShowPulse(false);
    setPulseComplete(true);
    localStorage.setItem('sm_pulse_done', 'true');

    const moodMap = { locked_in:'locked in', steady:'steady', distracted:'a bit distracted', tired:'tired today', struggling:'in a tough spot' };
    const moodText = answers.mood ? moodMap[answers.mood] || 'checking in' : 'checking in';
    const struggled = answers.struggled?.length ? `you noted struggling with ${answers.struggled.slice(0,2).join(' and ')}` : null;
    const overcame  = answers.overcame?.length  ? `overcame ${answers.overcame[0]}` : null;
    const tomorrow  = answers.tomorrow;
    const parts = [`You're ${moodText}`, struggled, overcame].filter(Boolean);

    setTimeout(() => setMessages(m => [...m, {
      from:'elijah',
      text:`Daily Pulse received. ${parts.join(' — ')}. ${tomorrow ? `You want to focus on ${tomorrow} tomorrow — noted.` : ''} That kind of honest self-reflection is what separates men who grow from men who stay stuck. Let's dig in.`
    }]), 600);
  };

  React.useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  }, [messages]);

  return (
    <View style={{ flex:1, height:'100%', overflow:'hidden', position:'relative' }}>
      <ScreenHeader eyebrow="⚔ Sharper Man" title="Daily" highlight="Check-In." right={<Badge text="Day 14" variant="gold" />} />

      {/* Daily Pulse banner */}
      {!pulseComplete ? (
        <div style={{ margin:'0 18px 8px', background:colors.cardGoldBg, borderRadius:18, border:`1px solid ${colors.goldBorder}`, padding:'12px 14px', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:999, background:colors.goldSubtle, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontSize:16 }}>⚔</span>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:fonts.body, fontSize:8, fontWeight:600, letterSpacing:1.8, textTransform:'uppercase', color:colors.gold, marginBottom:2 }}>Daily Pulse</div>
            <div style={{ fontFamily:fonts.body, fontSize:11, color:colors.whiteDim, lineHeight:'15px' }}>6 reflective questions — takes under 2 minutes</div>
          </div>
          <button onClick={() => setShowPulse(true)} style={{ padding:'7px 14px', borderRadius:999, background:colors.gold, border:'none', fontFamily:fonts.body, fontSize:11, fontWeight:600, color:'#000', cursor:'pointer', flexShrink:0 }}>Begin</button>
        </div>
      ) : (
        <div style={{ margin:'0 18px 8px', background:colors.charcoal, borderRadius:14, border:`1px solid rgba(76,175,120,0.2)`, padding:'9px 14px', display:'flex', alignItems:'center', gap:10 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="rgba(76,175,120,0.15)"/><path d="M4 7l2 2 4-4" stroke="#4CAF78" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontFamily:fonts.body, fontSize:10, color:colors.success }}>Daily Pulse complete</span>
          <button onClick={() => { setPulseComplete(false); localStorage.removeItem('sm_pulse_done'); }} style={{ marginLeft:'auto', background:'none', border:'none', fontFamily:fonts.body, fontSize:9, color:colors.grey, cursor:'pointer' }}>Redo</button>
        </div>
      )}

      {/* Chat */}
      <div ref={messagesEndRef} style={{ flex:1, overflowY:'auto', padding:'4px 18px', display:'flex', flexDirection:'column', gap:2, minHeight:0, maxHeight:'calc(100% - 200px)' }}>
        {messages.map((m,i) => m.from==='elijah' ? <ElijahBubble key={i} text={m.text} /> : <UserBubble key={i} text={m.text} />)}
      </div>

      {/* Input */}
      <View style={{ padding:'8px 14px 12px', borderTop:`1px solid ${colors.borderDim}`, background:colors.charcoalDeep, flexDirection:'row', gap:8, alignItems:'center' }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()} placeholder="Message Elijah…"
          style={{ flex:1, height:40, borderRadius:999, background:colors.charcoal, border:`1px solid ${colors.borderSubtle}`, padding:'0 14px', fontFamily:fonts.body, fontSize:11, color:colors.white, outline:'none' }} />
        <button onClick={send} style={{ width:40, height:40, borderRadius:999, background:colors.gold, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 8L2.5 3l2 5-2 5 11-5z" fill="#000"/></svg>
        </button>
      </View>

      {showPulse && <DailyPulse onComplete={handlePulseComplete} onDismiss={() => setShowPulse(false)} />}
    </View>
  );
};
Object.assign(window, { CheckInScreen });
