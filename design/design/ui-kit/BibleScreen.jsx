// BibleScreen — Sharper Man UI Kit
const BibleScreen = () => {
  const { colors, fonts, View, Text, ScreenHeader, Card, CardLabel, Badge, ProgressBar } = SM;
  const [selected, setSelected] = React.useState('All');
  const filters = ['All','Old Testament','New Testament','Psalms','Proverbs'];
  const tracks = [
    { title:'Proverbs: Wisdom for Men', days:'30 days', progress:60, pillar:'spiritual', locked:false, active:true },
    { title:'Identity in Christ', days:'21 days', progress:0, pillar:'spiritual', locked:false, active:false },
    { title:'Mental Clarity & Focus', days:'14 days', progress:0, pillar:'mental', locked:true, active:false },
    { title:'Discipline of the Body', days:'28 days', progress:0, pillar:'physical', locked:true, active:false },
    { title:'Prayer & Fasting', days:'7 days', progress:0, pillar:'spiritual', locked:false, active:false },
    { title:'The Man of God', days:'40 days', progress:0, pillar:'spiritual', locked:true, active:false },
  ];
  const pillarColor = { spiritual:colors.gold, mental:colors.mental, physical:colors.physical };
  return (
    <View style={{ flex:1, overflowY:'auto', paddingBottom:16 }}>
      <ScreenHeader
        eyebrow="⚔ Sharper Man"
        title="Bible"
        highlight="Tracks."
        right={<Badge text="ESV" variant="gold" />}
      />
      <View style={{ padding:'0 18px 8px' }}>
        {/* Search */}
        <View style={{ flexDirection:'row', alignItems:'center', background:colors.charcoalDeep, borderRadius:999, padding:'0 14px', height:38, marginBottom:12, gap:8 }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke={colors.grey} strokeWidth="1.4"/><path d="M9 9l2.5 2.5" stroke={colors.grey} strokeWidth="1.4" strokeLinecap="round"/></svg>
          <Text style={{ fontFamily:fonts.body, fontSize:11, color:colors.whiteMuted }}>Search tracks…</Text>
        </View>
      </View>

      {/* Filter chips */}
      <div style={{ display:'flex', gap:5, overflowX:'auto', padding:'0 18px 10px', scrollbarWidth:'none' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setSelected(f)} style={{
            padding:'5px 12px', borderRadius:999, border:`1px solid ${selected===f ? colors.goldBorder : 'rgba(255,255,255,0.08)'}`,
            background: selected===f ? colors.goldSubtle : 'transparent',
            fontFamily:fonts.body, fontSize:10, fontWeight:600,
            color: selected===f ? colors.gold : colors.whiteDim,
            cursor:'pointer', whiteSpace:'nowrap', flexShrink:0,
          }}>{f}</button>
        ))}
      </div>

      <View style={{ padding:'0 18px' }}>
        {/* Active track */}
        {tracks.filter(t=>t.active).map(t => (
          <Card key={t.title}>
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
              <CardLabel text="Current Track" />
              <Badge text={t.pillar} variant={t.pillar} />
            </View>
            <Text style={{ fontFamily:fonts.display, fontSize:18, fontWeight:700, color:colors.white, lineHeight:'22px', display:'block', marginBottom:6 }}>{t.title}</Text>
            <ProgressBar value={t.progress} color={pillarColor[t.pillar]} />
            <Text style={{ fontFamily:fonts.body, fontSize:9, color:colors.grey }}>{t.days} · {t.progress}% complete</Text>
          </Card>
        ))}

        {/* Track grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {tracks.filter(t=>!t.active).map(t => (
            <View key={t.title} style={{ background:colors.charcoal, borderRadius:18, padding:12, position:'relative', opacity: t.locked ? 0.65 : 1 }}>
              {t.locked && (
                <View style={{ position:'absolute', top:10, right:10 }}>
                  <Badge text="Premium" variant="premium" />
                </View>
              )}
              <View style={{ width:28, height:28, borderRadius:999, background: t.pillar==='spiritual' ? colors.goldSubtle : t.pillar==='mental' ? colors.mentalSubtle : colors.physicalSubtle, alignItems:'center', justifyContent:'center', marginBottom:8 }}>
                <span style={{ fontSize:13 }}>{t.pillar==='spiritual' ? '📖' : t.pillar==='mental' ? '🧠' : '💪'}</span>
              </View>
              <Text style={{ fontFamily:fonts.display, fontSize:13, fontWeight:700, color:colors.white, lineHeight:'17px', display:'block', marginBottom:4 }}>{t.title}</Text>
              <Text style={{ fontFamily:fonts.body, fontSize:9, color:colors.grey }}>{t.days}</Text>
            </View>
          ))}
        </div>
      </View>
    </View>
  );
};
Object.assign(window, { BibleScreen });
