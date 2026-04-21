// Sharper Man — Shared Primitive Components
// Exported to window for use by screen components

const SM = (() => {

// ── Tokens ──────────────────────────────────────────────────
const colors = {
  black:'#080808', charcoalDeep:'#0F0F0F', charcoal:'#1A1A1A',
  charcoalMid:'#242424', charcoalLight:'#2A2A2A', charcoalBorder:'#252525',
  gold:'#C8A84B', goldLight:'#E4C97A', goldDim:'#8A6F2E',
  goldSubtle:'rgba(200,168,75,0.12)', goldBorder:'rgba(200,168,75,0.30)',
  goldTint:'rgba(200,168,75,0.07)', goldPill:'rgba(200,168,75,0.18)',
  cardGoldBg:'#0F0C03',
  white:'#F5F0E8', whiteDim:'#B8B0A0', whiteMuted:'#706860', grey:'#555555',
  spiritual:'#C8A84B', mental:'#4B8EC8', mentalSubtle:'rgba(75,142,200,0.15)',
  physical:'#7C4BC8', physicalSubtle:'rgba(124,75,200,0.15)',
  success:'#4CAF78', error:'#E07060',
  borderDim:'rgba(255,255,255,0.06)', borderSubtle:'rgba(255,255,255,0.08)',
};

const fonts = {
  display: "'Cormorant Garamond', Georgia, serif",
  body:    "'DM Sans', system-ui, sans-serif",
  mono:    "'DM Mono', monospace",
};

// ── Base elements ────────────────────────────────────────────
const Text = ({ style, children, ...p }) => (
  <span style={{ fontFamily: fonts.body, color: colors.white, ...style }} {...p}>{children}</span>
);

const View = ({ style, children, ...p }) => (
  <div style={{ display:'flex', flexDirection:'column', ...style }} {...p}>{children}</div>
);

// ── Screen Header ────────────────────────────────────────────
const ScreenHeader = ({ eyebrow, title, highlight, right }) => (
  <View style={{ paddingLeft:18, paddingRight:18, paddingTop:12, paddingBottom:6 }}>
    <View style={{ flexDirection:'row', alignItems:'flex-start', justifyContent:'space-between' }}>
      <View>
        <Text style={{ fontFamily:fonts.body, fontSize:8, fontWeight:600, letterSpacing:2, textTransform:'uppercase', color:colors.grey, marginBottom:2 }}>{eyebrow}</Text>
        <Text style={{ fontFamily:fonts.display, fontSize:28, lineHeight:'32px', fontWeight:700, color:colors.white }}>
          {title}{highlight && <><br/><em style={{ color:colors.gold }}>{highlight}</em></>}
        </Text>
      </View>
      {right && <div style={{ marginTop:4 }}>{right}</div>}
    </View>
  </View>
);

// ── Card ─────────────────────────────────────────────────────
const Card = ({ children, gold, style }) => (
  <View style={{
    background: gold ? colors.cardGoldBg : colors.charcoal,
    borderRadius:22, padding:14, marginBottom:8,
    border: gold ? `1px solid ${colors.goldBorder}` : 'none',
    ...style,
  }}>{children}</View>
);

// ── CardLabel ────────────────────────────────────────────────
const CardLabel = ({ text, color }) => (
  <Text style={{ fontFamily:fonts.body, fontSize:8, fontWeight:600, letterSpacing:1.8, textTransform:'uppercase', color: color || colors.gold, marginBottom:6, display:'block' }}>{text}</Text>
);

// ── Badge ────────────────────────────────────────────────────
const Badge = ({ text, variant='gold' }) => {
  const map = {
    gold:    { bg: colors.goldSubtle, color: colors.gold },
    blue:    { bg: colors.mentalSubtle, color:'#88B8E8' },
    purple:  { bg: colors.physicalSubtle, color:'#A888E8' },
    premium: { bg:'rgba(138,111,46,0.1)', color: colors.goldDim },
    success: { bg:'rgba(76,175,120,0.15)', color: colors.success },
  };
  const s = map[variant] || map.gold;
  return (
    <span style={{ background:s.bg, borderRadius:999, padding:'3px 9px', fontFamily:fonts.body, fontSize:8, fontWeight:600, letterSpacing:1, textTransform:'uppercase', color:s.color }}>{text}</span>
  );
};

// ── ProgressBar ──────────────────────────────────────────────
const ProgressBar = ({ value, color }) => (
  <View style={{ height:5, background:colors.charcoalLight, borderRadius:999, overflow:'hidden', margin:'5px 0' }}>
    <View style={{ height:'100%', width:`${Math.min(100,Math.max(0,value))}%`, background: color || colors.gold, borderRadius:999, flexDirection:'row' }} />
  </View>
);

// ── StatChipRow ──────────────────────────────────────────────
const StatChipRow = ({ items }) => (
  <View style={{ flexDirection:'row', gap:6, marginBottom:8 }}>
    {items.map(({ value, label, color }) => (
      <View key={label} style={{ flex:1, background:colors.charcoal, borderRadius:16, paddingTop:10, paddingBottom:10, paddingLeft:6, paddingRight:6, alignItems:'center' }}>
        <Text style={{ fontFamily:fonts.display, fontSize:21, lineHeight:'24px', fontWeight:700, color: color || colors.gold }}>{value}</Text>
        <Text style={{ fontFamily:fonts.body, fontSize:9, color:colors.grey, textTransform:'uppercase', letterSpacing:0.8, marginTop:2 }}>{label}</Text>
      </View>
    ))}
  </View>
);

// ── PrimaryButton ────────────────────────────────────────────
const PrimaryButton = ({ label, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{
    width:'100%', height:48, background: disabled ? colors.charcoalLight : colors.gold,
    borderRadius:999, border:'none', fontFamily:fonts.body, fontSize:13, fontWeight:600,
    color: disabled ? colors.whiteMuted : '#000', cursor: disabled ? 'not-allowed' : 'pointer',
    marginTop:8, transition:'opacity .15s',
  }}>{label}</button>
);

// ── SecondaryButton ──────────────────────────────────────────
const SecondaryButton = ({ label, onClick }) => (
  <button onClick={onClick} style={{
    width:'100%', height:42, background:'transparent', borderRadius:999,
    border:`1.5px solid rgba(200,168,75,0.35)`, fontFamily:fonts.body, fontSize:12,
    fontWeight:600, color:colors.gold, cursor:'pointer', marginTop:6,
  }}>{label}</button>
);

// ── VerseBlock ───────────────────────────────────────────────
const VerseBlock = ({ reference, text }) => (
  <View style={{ background:colors.goldTint, borderLeft:`2px solid ${colors.goldDim}`, borderTopRightRadius:18, borderBottomRightRadius:18, paddingTop:9, paddingBottom:9, paddingLeft:11, paddingRight:11, marginBottom:8 }}>
    {reference && <Text style={{ fontFamily:fonts.body, fontSize:8, fontWeight:600, letterSpacing:1.8, textTransform:'uppercase', color:colors.gold, marginBottom:3, display:'block' }}>{reference}</Text>}
    <Text style={{ fontFamily:fonts.display, fontSize:13, lineHeight:'21px', fontWeight:700, fontStyle:'italic', color:colors.goldLight }}>{text}</Text>
  </View>
);

// ── WeekStrip ────────────────────────────────────────────────
const WeekStrip = ({ days }) => {
  const labels = ['M','T','W','T','F','S','S'];
  return (
    <View style={{ flexDirection:'row', gap:3 }}>
      {labels.map((d,i) => (
        <View key={i} style={{ flex:1, alignItems:'center' }}>
          <View style={{ height:22, width:'100%', borderRadius:6, background:
            days[i]==='done' ? colors.gold :
            days[i]==='partial' ? 'rgba(200,168,75,0.35)' :
            colors.charcoalBorder }} />
          <Text style={{ fontFamily:fonts.body, fontSize:9, color:colors.grey, marginTop:2 }}>{d}</Text>
        </View>
      ))}
    </View>
  );
};

// ── ElijahBubble + UserBubble ────────────────────────────────
const ElijahBubble = ({ text }) => (
  <View style={{ marginBottom:6, maxWidth:'85%' }}>
    <Text style={{ fontFamily:fonts.body, fontSize:8, fontWeight:600, letterSpacing:1.8, textTransform:'uppercase', color:colors.gold, marginBottom:3, display:'block' }}>Elijah</Text>
    <View style={{ background:colors.charcoal, borderRadius:16, borderTopLeftRadius:3, borderLeft:`2px solid ${colors.goldDim}`, paddingTop:9, paddingBottom:9, paddingLeft:12, paddingRight:12 }}>
      <Text style={{ fontFamily:fonts.body, fontSize:11, lineHeight:'18px', color:colors.whiteDim }}>{text}</Text>
    </View>
  </View>
);

const UserBubble = ({ text }) => (
  <View style={{ alignItems:'flex-end', marginBottom:6 }}>
    <View style={{ background:'rgba(200,168,75,0.10)', borderRadius:16, borderTopRightRadius:3, paddingTop:9, paddingBottom:9, paddingLeft:12, paddingRight:12, maxWidth:'80%' }}>
      <Text style={{ fontFamily:fonts.body, fontSize:11, lineHeight:'18px', color:colors.goldLight }}>{text}</Text>
    </View>
  </View>
);

// ── PrayerCard ───────────────────────────────────────────────
const PrayerCard = ({ name, initials, avatarVariant='gold', time, text, reactions }) => {
  const [reacted, setReacted] = React.useState(null);
  const avColors = {
    gold:   { bg:'rgba(200,168,75,0.12)', text:colors.gold },
    blue:   { bg:'rgba(75,142,200,0.15)', text:'#4B8EC8' },
    purple: { bg:'rgba(124,75,200,0.15)', text:'#7C4BC8' },
  };
  const av = avColors[avatarVariant] || avColors.gold;
  return (
    <View style={{ background:colors.charcoal, borderRadius:18, padding:13, marginBottom:7 }}>
      <View style={{ flexDirection:'row', alignItems:'center', gap:7, marginBottom:7 }}>
        <View style={{ width:26, height:26, borderRadius:999, background:av.bg, alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Text style={{ fontFamily:fonts.body, fontSize:9, fontWeight:600, color:av.text }}>{initials}</Text>
        </View>
        <Text style={{ fontFamily:fonts.body, fontSize:11, fontWeight:600, color:colors.white, flex:1 }}>{name}</Text>
        <Text style={{ fontFamily:fonts.body, fontSize:9, color:colors.grey }}>{time}</Text>
      </View>
      <Text style={{ fontFamily:fonts.body, fontSize:11, lineHeight:'17px', color:colors.whiteDim, marginBottom:8, display:'block' }}>{text}</Text>
      <View style={{ flexDirection:'row', gap:5 }}>
        {reactions.map(r => (
          <button key={r.type} onClick={() => setReacted(r.type)} style={{
            padding:'4px 9px', borderRadius:999,
            background: reacted===r.type ? 'rgba(200,168,75,0.10)' : 'rgba(255,255,255,0.05)',
            border:'none', cursor:'pointer',
            fontFamily:fonts.body, fontSize:10,
            color: reacted===r.type ? colors.gold : colors.whiteDim,
          }}>{r.emoji} {r.label} · {reacted===r.type ? r.count+1 : r.count}</button>
        ))}
      </View>
    </View>
  );
};

// ── PillarRow ────────────────────────────────────────────────
const PillarRow = ({ pillar, value, note }) => {
  const map = { spiritual:{color:colors.gold,label:'Spiritual'}, mental:{color:colors.mental,label:'Mental'}, physical:{color:colors.physical,label:'Physical'} };
  const { color, label } = map[pillar];
  return (
    <View style={{ marginBottom:10 }}>
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
        <Text style={{ fontFamily:fonts.body, fontSize:8, fontWeight:600, letterSpacing:1.8, textTransform:'uppercase', color }}>{label}</Text>
        <Text style={{ fontFamily:fonts.display, fontSize:20, fontWeight:700, color }}>{Math.round(value)}%</Text>
      </View>
      <ProgressBar value={value} color={color} />
      {note && <Text style={{ fontFamily:fonts.body, fontSize:9, color:colors.grey, marginTop:1, display:'block' }}>{note}</Text>}
    </View>
  );
};

return { colors, fonts, Text, View, ScreenHeader, Card, CardLabel, Badge, ProgressBar, StatChipRow, PrimaryButton, SecondaryButton, VerseBlock, WeekStrip, ElijahBubble, UserBubble, PrayerCard, PillarRow };
})();

Object.assign(window, { SM });
