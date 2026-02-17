
import React from 'react';
import { Sparkles } from './Decorations';

const DUA_LIST = {
  ramadan: [
    { arabic: "اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالإِيمَانِ وَالسَّلامَةِ وَالإِسْلامِ رَبِّي وَرَبُّكَ اللَّهُ", transliteration: "Allahumma ahillahu 'alayna bil-yumni wal-iman, was-salamati wal-islam, rabbi wa rabbuka Allah", meaning: "O Allah, let this moon appear on us with blessing and faith, with safety and Islam. My Lord and your Lord is Allah.", category: "Moon Sighting" },
    { arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", transliteration: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni", meaning: "O Allah, You are Forgiving and You love forgiveness, so forgive me.", category: "Laylatul Qadr" },
    { arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ", transliteration: "Allahumma inni as'alukal 'afwa wal-'afiyah fid-dunya wal-akhirah", meaning: "O Allah, I ask You for forgiveness and well-being in this world and the Hereafter.", category: "Laylatul Qadr" },
    { arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ", transliteration: "Dhahaba al-zam'u wa-btallat al-'uruqu wa-thabata al-ajru in sha' Allah", meaning: "The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.", category: "Breaking Fast" },
  ],
  duniya: [
    { arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ", transliteration: "Rabbi awzi'ni an ashkura ni'matakal-lati an'amta 'alayya wa 'ala walidayya wa an a'mala salihan tardhahu wa adkhilni birahmatika fi 'ibadikas-salihin", meaning: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents and to do righteousness of which You approve. And admit me by Your mercy into [the ranks of] Your righteous servants.", category: "Gratitude" },
    { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina 'adhaban-nar", meaning: "Our Lord, give us in this world that which is good and in the Hereafter that which is good, and save us from the punishment of the Fire.", category: "Ultimate Success" },
    { arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", transliteration: "Rabbi irhamhuma kama rabbayani saghira", meaning: "My Lord, have mercy upon them [parents] as they brought me up [when I was] small.", category: "Parents" },
    { arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلاً مُتَقَبَّلاً", transliteration: "Allahumma inni as'aluka 'ilman nafi'an wa rizqan tayyiba wa 'amalan mutaqabbala", meaning: "O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.", category: "Rizq & Knowledge" },
  ],
  protection: [
    { arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ", transliteration: "Allahumma inni a'udhu bika min fitnatil-mahya wal-mamat, wa min sharri fitnatil-masihid-dajjal", meaning: "O Allah, I seek refuge in You from the fitnah of life and death, and from the evil fitnah of the Dajjal.", category: "Against Fitnah" },
    { arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا", transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana", meaning: "Our Lord, let not our hearts deviate after You have guided us.", category: "Guidance & Fitnah" },
    { arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ", transliteration: "Ya Muqallibal-qulubi thabbit qalbi 'ala dinika", meaning: "O Turner of the hearts, keep my heart steadfast upon Your religion.", category: "Steadfastness" },
  ],
  hereafter: [
    { arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ", transliteration: "Allahumma anta Rabbi la ilaha illa anta, Khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, A'udhu bika min sharri ma sana'tu, abu'u laka bini'matika 'alayya, wa abu'u laka bidhanbi faghfir li fa'innahu la yaghfirudh-dhunuba illa anta", meaning: "O Allah, You are my Lord, there is no god but You. You created me and I am Your servant, and I am faithful to my covenant and my promise as much as I can. I seek refuge in You from all the evil I have done. I acknowledge before You all the blessings You have bestowed upon me, and I confess to You all my sins. So I entreat You to forgive my sins, for nobody can forgive sins except You.", category: "Sayyidul Istighfar" },
    { arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ", transliteration: "Allahumma inni as'aluka al-jannah wa a'udhu bika minan-nar", meaning: "O Allah, I ask You for Paradise and seek Your protection from Hellfire.", category: "Protection" },
    { arabic: "رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا وَتَوَفَّنَا مَعَ الأَبْرَارِ", transliteration: "Rabbana faghfir lana dhunubana wa kaffir 'anna sayyi'atina wa tawaffana ma'al-abrar", meaning: "Our Lord, forgive us our sins, remove from us our misdeeds and cause us to die with the righteous.", category: "Forgiveness" },
    { arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي", transliteration: "Rabbi-j'alni muqima-salati wa min dhurriyyati", meaning: "My Lord, make me an establisher of prayer, and [many] from my descendants.", category: "Guidance" },
  ]
};

const RecommendedDuas: React.FC = () => {
  return (
    <div className="p-8 pt-20 space-y-16 animate-fade-in relative pb-40 min-h-screen">
      <Sparkles className="inset-0 opacity-20" />
      
      <div className="text-center space-y-4 relative z-10">
        <h2 className="text-7xl font-dancing text-pink-500 drop-shadow-sm">Dua Library</h2>
        <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px]">Essential Supplications for the Sacred Month</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-20 relative z-10">
        
        {/* Ramadan Essentials Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="h-px flex-1 bg-pink-100"></div>
             <h3 className="text-xs font-black uppercase tracking-[0.5em] text-pink-300">The Ramadan Essentials</h3>
             <div className="h-px flex-1 bg-pink-100"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DUA_LIST.ramadan.map((dua, i) => <DuaCard key={i} {...dua} />)}
          </div>
        </section>

        {/* Protection & Steadfastness Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="h-px flex-1 bg-rose-100"></div>
             <h3 className="text-xs font-black uppercase tracking-[0.5em] text-rose-300">Protection & Steadfastness</h3>
             <div className="h-px flex-1 bg-rose-100"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DUA_LIST.protection.map((dua, i) => <DuaCard key={i} {...dua} color="indigo" />)}
          </div>
        </section>

        {/* For This Life Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="h-px flex-1 bg-amber-100"></div>
             <h3 className="text-xs font-black uppercase tracking-[0.5em] text-amber-300">For This Life (Duniya)</h3>
             <div className="h-px flex-1 bg-amber-100"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DUA_LIST.duniya.map((dua, i) => <DuaCard key={i} {...dua} color="amber" />)}
          </div>
        </section>

        {/* For The Hereafter Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="h-px flex-1 bg-indigo-100"></div>
             <h3 className="text-xs font-black uppercase tracking-[0.5em] text-indigo-300">For The Hereafter (Akhirah)</h3>
             <div className="h-px flex-1 bg-indigo-100"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DUA_LIST.hereafter.map((dua, i) => <DuaCard key={i} {...dua} color="indigo" />)}
          </div>
        </section>

      </div>
    </div>
  );
};

const DuaCard: React.FC<{ arabic: string; transliteration: string; meaning: string; category: string; color?: 'pink' | 'amber' | 'indigo' }> = ({ arabic, transliteration, meaning, category, color = 'pink' }) => {
  const colors = {
    pink: 'from-pink-50 border-pink-100 text-pink-600 ring-pink-50',
    amber: 'from-amber-50 border-amber-100 text-amber-600 ring-amber-50',
    indigo: 'from-indigo-50 border-indigo-100 text-indigo-600 ring-indigo-50'
  };

  return (
    <div className={`p-10 rounded-[3rem] bg-gradient-to-br to-white border shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden ${colors[color]}`}>
      <div className="absolute top-0 right-0 p-6 opacity-5 text-4xl group-hover:scale-150 transition-transform">✨</div>
      <div className="space-y-6">
        <span className="text-[9px] font-black uppercase tracking-widest opacity-50 block">{category}</span>
        <p className="font-arabic text-3xl md:text-4xl leading-loose text-right text-gray-800" dir="rtl">{arabic}</p>
        <div className="space-y-2">
          <p className="text-[11px] font-bold italic text-gray-400 leading-relaxed">{transliteration}</p>
          <div className="h-px w-8 bg-current opacity-20"></div>
          <p className="text-sm font-medium text-gray-600 leading-relaxed">{meaning}</p>
        </div>
      </div>
    </div>
  );
};

export default RecommendedDuas;
