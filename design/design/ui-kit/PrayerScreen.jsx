// PrayerScreen — Sharper Man UI Kit
const PrayerScreen = () => {
  const { colors, fonts, View, Text, ScreenHeader, PrayerCard } = SM;
  const [selected, setSelected] = React.useState('All');
  const filters = ['All','Praise','Request','Family','Work','Health'];
  const prayers = [
    { name:'Marcus Johnson', initials:'MJ', avatarVariant:'gold', time:'2h ago', text:"Praying for clarity on a big career decision. Feel like God is moving but I need discernment. Appreciate your prayers, brothers.", reactions:[{type:'pray',emoji:'🙏',label:'Praying',count:12},{type:'stand',emoji:'💪',label:'Standing',count:4},{type:'love',emoji:'❤️',label:'With you',count:7}] },
    { name:'David Chen', initials:'DC', avatarVariant:'blue', time:'4h ago', text:"My father is in the hospital. Doctors say he's stable but we're still waiting for test results. Please lift him up.", reactions:[{type:'pray',emoji:'🙏',label:'Praying',count:28},{type:'stand',emoji:'💪',label:'Standing',count:9},{type:'love',emoji:'❤️',label:'With you',count:14}] },
    { name:'James Rivera', initials:'JR', avatarVariant:'purple', time:'Yesterday', text:"Praise God — got the job offer after months of searching. He is faithful. Thank you all for praying with me.", reactions:[{type:'pray',emoji:'🙏',label:'Praying',count:6},{type:'stand',emoji:'💪',label:'Standing',count:11},{type:'love',emoji:'❤️',label:'With you',count:19}] },
    { name:'Tyler Brooks', initials:'TB', avatarVariant:'gold', time:'2 days ago', text:"Struggling with consistency in my morning routine. Keep pushing it off. Need accountability and prayer for discipline.", reactions:[{type:'pray',emoji:'🙏',label:'Praying',count:8},{type:'stand',emoji:'💪',label:'Standing',count:15},{type:'love',emoji:'❤️',label:'With you',count:3}] },
  ];
  return (
    <View style={{ flex:1, overflowY:'auto', paddingBottom:16 }}>
      <ScreenHeader
        eyebrow="⚔ Sharper Man"
        title="Prayer"
        highlight="Wall."
        right={
          <button style={{ padding:'5px 12px', borderRadius:999, background:colors.goldSubtle, border:`1px solid ${colors.goldBorder}`, fontFamily:fonts.body, fontSize:9, fontWeight:600, letterSpacing:1, textTransform:'uppercase', color:colors.gold, cursor:'pointer' }}>+ Submit</button>
        }
      />
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
        {prayers.map((p,i) => <PrayerCard key={i} {...p} />)}
      </View>
    </View>
  );
};
Object.assign(window, { PrayerScreen });
