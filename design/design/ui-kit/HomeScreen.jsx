// HomeScreen — Sharper Man UI Kit
const HomeScreen = () => {
  const { colors, fonts, View, Text, ScreenHeader, Card, CardLabel, StatChipRow, VerseBlock, WeekStrip, Badge } = SM;
  return (
    <View style={{ flex:1, overflowY:'auto', paddingBottom:16 }}>
      <ScreenHeader
        eyebrow="⚔ Sharper Man"
        title="Good morning,"
        highlight="Marcus."
        right={<div style={{ width:34, height:34, borderRadius:999, background:'rgba(200,168,75,0.12)', border:`1px solid ${colors.goldBorder}`, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontFamily:fonts.body, fontSize:11, fontWeight:600, color:colors.gold }}>MJ</span></div>}
      />

      <View style={{ padding:'4px 18px 0' }}>
        <StatChipRow items={[
          { value:'14', label:'Day Streak', color:colors.gold },
          { value:'68%', label:'Track', color:colors.mental },
          { value:'↑', label:'Wellness', color:colors.success },
        ]} />

        {/* Today's Reading */}
        <Card>
          <CardLabel text="Today's Reading" />
          <Text style={{ fontFamily:fonts.display, fontSize:18, fontWeight:700, color:colors.white, lineHeight:'22px' }}>Proverbs 27</Text>
          <VerseBlock reference="Proverbs 27:17" text='"As iron sharpens iron, so one person sharpens another."' />
          <View style={{ height:5, background:colors.charcoalLight, borderRadius:999, overflow:'hidden', marginBottom:4 }}>
            <View style={{ height:'100%', width:'60%', background:colors.gold, borderRadius:999 }} />
          </View>
          <Text style={{ fontFamily:fonts.body, fontSize:9, color:colors.grey }}>3 of 5 days complete</Text>
        </Card>

        {/* Elijah Coach */}
        <Card gold>
          <View style={{ flexDirection:'row', alignItems:'center', gap:10, marginBottom:8 }}>
            <View style={{ width:38, height:38, borderRadius:999, background:'rgba(200,168,75,0.15)', border:`1px solid ${colors.goldBorder}`, alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:18 }}>⚔</span>
            </View>
            <View>
              <CardLabel text="Your Coach" />
              <Text style={{ fontFamily:fonts.display, fontSize:18, fontWeight:700, color:colors.white, lineHeight:'20px' }}>Elijah</Text>
            </View>
          </View>
          <Text style={{ fontFamily:fonts.body, fontSize:11, lineHeight:'17px', color:colors.whiteDim, display:'block', marginBottom:10 }}>
            Good morning, Marcus. You've kept your streak alive 14 days. Ready to check in?
          </Text>
          <button style={{ width:'100%', height:44, background:colors.gold, borderRadius:999, border:'none', fontFamily:fonts.body, fontSize:13, fontWeight:600, color:'#000', cursor:'pointer' }}>
            Start Check-In
          </button>
        </Card>

        {/* This Week */}
        <Card>
          <CardLabel text="This Week" />
          <WeekStrip days={['done','done','done','partial','done','empty','empty']} />
        </Card>
      </View>
    </View>
  );
};
Object.assign(window, { HomeScreen });
