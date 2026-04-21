// ProgressScreen — Sharper Man UI Kit
const ProgressScreen = () => {
  const { colors, fonts, View, Text, ScreenHeader, Card, CardLabel, StatChipRow, PillarRow, Badge } = SM;
  return (
    <View style={{ flex:1, overflowY:'auto', paddingBottom:16 }}>
      <ScreenHeader
        eyebrow="⚔ Sharper Man"
        title="Your"
        highlight="Progress."
        right={<Badge text="30 Days" variant="gold" />}
      />
      <View style={{ padding:'4px 18px 0' }}>
        <StatChipRow items={[
          { value:'14', label:'Streak', color:colors.gold },
          { value:'3', label:'Tracks', color:colors.mental },
          { value:'62%', label:'Overall', color:colors.physical },
        ]} />

        {/* Three Pillars */}
        <Card>
          <CardLabel text="Three Pillars" />
          <PillarRow pillar="spiritual" value={82} note="5-day reading streak · on track" />
          <PillarRow pillar="mental" value={61} note="2 check-ins this week" />
          <PillarRow pillar="physical" value={44} note="Missed 3 workouts this week" />
        </Card>

        {/* Streaks */}
        <Card>
          <CardLabel text="Streaks" />
          {[
            { label:'Current Streak', value:'14 days', color:colors.gold },
            { label:'Longest Streak', value:'21 days', color:colors.goldDim },
            { label:'Total Check-Ins', value:'47', color:colors.whiteDim },
          ].map(({ label, value, color }) => (
            <View key={label} style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingTop:8, paddingBottom:8, borderBottom:`1px solid ${colors.borderDim}` }}>
              <Text style={{ fontFamily:fonts.body, fontSize:11, color:colors.whiteDim }}>{label}</Text>
              <Text style={{ fontFamily:fonts.display, fontSize:18, fontWeight:700, color }}>{value}</Text>
            </View>
          ))}
        </Card>

        {/* Tracks Completed */}
        <Card>
          <CardLabel text="Tracks Completed" />
          {[
            { title:'30 Days of Psalms', pillar:'spiritual', date:'Mar 2025' },
            { title:'Mental Reset', pillar:'mental', date:'Feb 2025' },
            { title:'Identity in Christ', pillar:'spiritual', date:'Jan 2025' },
          ].map(({ title, pillar, date }) => {
            const pColor = pillar==='spiritual' ? colors.gold : pillar==='mental' ? colors.mental : colors.physical;
            return (
              <View key={title} style={{ flexDirection:'row', alignItems:'center', gap:10, paddingTop:8, paddingBottom:8, borderBottom:`1px solid ${colors.borderDim}` }}>
                <View style={{ width:6, height:6, borderRadius:999, background:pColor, flexShrink:0 }} />
                <Text style={{ fontFamily:fonts.body, fontSize:11, color:colors.white, flex:1 }}>{title}</Text>
                <Text style={{ fontFamily:fonts.body, fontSize:9, color:colors.grey }}>{date}</Text>
              </View>
            );
          })}
        </Card>
      </View>
    </View>
  );
};
Object.assign(window, { ProgressScreen });
