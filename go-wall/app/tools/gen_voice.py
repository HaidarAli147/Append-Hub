"""Generate the commentator's voice clips (same male voice in every browser).

    pip install edge-tts
    python tools/gen_voice.py

Clips are short phrases + numbers that js/app.js chains together, in Arabic
(audio/ar) and English (audio/en). The output is committed, so the site needs
no TTS service at runtime. Existing files are skipped; delete one to redo it.
"""
import asyncio
import os
import edge_tts

VOICES = {'ar': 'ar-SA-HamedNeural', 'en': 'en-US-GuyNeural'}   # both male
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'audio')

ONES_AR = ['صِفْر', 'وَاحِد', 'اثْنَان', 'ثَلَاثَة', 'أَرْبَعَة', 'خَمْسَة', 'سِتَّة', 'سَبْعَة', 'ثَمَانِيَة', 'تِسْعَة', 'عَشَرَة',
           'أَحَدَ عَشَر', 'اثْنَا عَشَر', 'ثَلَاثَةَ عَشَر', 'أَرْبَعَةَ عَشَر', 'خَمْسَةَ عَشَر', 'سِتَّةَ عَشَر', 'سَبْعَةَ عَشَر', 'ثَمَانِيَةَ عَشَر', 'تِسْعَةَ عَشَر']
TENS_AR = {20: 'عِشْرُون', 30: 'ثَلَاثُون', 40: 'أَرْبَعُون', 50: 'خَمْسُون', 60: 'سِتُّون', 70: 'سَبْعُون', 80: 'ثَمَانُون', 90: 'تِسْعُون'}
ONES_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
           'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
TENS_EN = {20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty', 60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety'}


def number_ar(n):
    if n >= 100:
        r = n - 100
        return 'مِئَة' if r == 0 else f'مِئَة و{number_ar(r)}'
    if n < 20:
        return ONES_AR[n]
    t, o = n // 10 * 10, n % 10
    return TENS_AR[t] if o == 0 else f'{ONES_AR[o]} و{TENS_AR[t]}'


def number_en(n):
    if n >= 100:
        r = n - 100
        return 'one hundred' if r == 0 else f'one hundred and {number_en(r)}'
    if n < 20:
        return ONES_EN[n]
    t, o = n // 10 * 10, n % 10
    return TENS_EN[t] if o == 0 else f'{TENS_EN[t]} {ONES_EN[o]}'


# id -> (arabic, english, hype)
CLIPS = {
    'goal_1': ('جوووووووول! جوووووول!', 'Goaaaaal! Goal! Goaaaal!', 1),
    'goal_2': ('هدف! هدف! هدف! يا سلام!', 'Goal! Goal! Goal! What a strike!', 1),
    'goal_3': ('جووووول! يا له من هدف رائع!', 'Gooooal! What a fantastic goal!', 1),
    'goal_4': ('يا إلهي! جوووووول!', 'Oh my! Goooooal!', 1),
    'goal_for': ('لصالح', 'for', 1),
    'score_is': ('النتيجة', 'The score is', 0),
    'vs': ('مقابل', 'to', 0),
    'left': ('بقي لديه', 'remaining:', 0),
    't1': ('الفريق الأول', 'Team One', 0), 't2': ('الفريق الثاني', 'Team Two', 0),
    'p1': ('اللاعب الأول', 'Player One', 0), 'p2': ('اللاعب الثاني', 'Player Two', 0),
    'score_fixed': ('تم تعديل النتيجة', 'Score corrected', 0),
    'foul_on': ('خطأ على', 'Foul on', 0),
    'foul_ref': ('صافرة الحكم، خطأ ضد', 'The referee blows, foul against', 0),
    'yellow': ('بطاقة صفراء! إنذار للاعب من', 'Yellow card! A booking for a player from', 1),
    'red': ('بطاقة حمراء! طرد مباشر للاعب من', 'Red card! Sent off, a player from', 1),
    'red_after': ('يكمل بنقص عددي', 'will play a man down', 1),
    'kick_off': ('صافرة البداية! انطلق', "It's kick-off! Underway:", 1),
    'resume': ('استؤنف اللعب', 'Play resumes', 0),
    'paused': ('توقف اللعب', 'Play is stopped', 0),
    'get_ready': ('استعدوا.', 'Get ready.', 0),
    'period_0': ('الشوط الأول', 'first half', 0), 'period_1': ('الشوط الثاني', 'second half', 0),
    'period_2': ('الشوط الإضافي الأول', 'first period of extra time', 0),
    'period_3': ('الشوط الإضافي الثاني', 'second period of extra time', 0),
    'regular_end': ('انتهى الوقت الأصلي. الحكم يحتسب وقتًا بدل ضائع', 'Regular time is up. The referee adds stoppage time', 1),
    'timeout': ('وقت مستقطع،', 'Timeout,', 0),
    'pen2': ('إيقاف لمدة دقيقتين للاعب في', 'Two-minute suspension for a player from', 0),
    'pen_back': ('انتهى إيقاف اللاعب، ويعود إلى الملعب في', 'Suspension over, the player returns for', 0),
    'break': ('استراحة بين الشوطين. استعدوا للشوط الثاني', 'Half-time break. Get ready for the second half', 0),
    'half_end': ('انتهى الشوط الأول. النتيجة', 'End of the first half. The score is', 0),
    'match_end': ('صافرة النهاية! انتهت المباراة. النتيجة', "That's the final whistle! Full time. The score is", 1),
    'voice_on': ('المعلق يعمل الآن', 'The commentator is on', 0),
    'scores_point': ('يسجل نقطة', 'wins the point', 0),
    'deuce': ('تعادل، ديوس', 'Deuce', 0),
    'adv': ('أفضلية لـ', 'Advantage', 0),
    'game_for': ('الشوط لصالح', 'Game to', 1),
    'games_are': ('الأشواط', 'Games', 0),
    'tb': ('شوط فاصل.', 'Tie-break.', 0),
    'tb_start': ('ستة أشواط لكل لاعب. نلجأ إلى الشوط الفاصل', 'Six games all. We go to a tie-break', 1),
    'set_for': ('المجموعة لصالح', 'Set to', 1),
    'match_over': ('انتهت المباراة! الفائز', 'Game, set and match! The winner is', 1),
    'congrats': ('مبروك!', 'Congratulations!', 1),
    # --- encouragement: makes the commentator cheer the players on ---
    'cheer_1': ('الله الله! استمروا يا أبطال!', "Incredible! Keep it up, champions!", 1),
    'cheer_2': ('ما شاء الله عليكم! أداء رائع!', 'Brilliant stuff! What a performance!', 1),
    'cheer_3': ('هكذا تكون كرة القدم! الجمهور يقف تصفيقًا!', 'That is why we love this game! The crowd is on its feet!', 1),
    'cheer_4': ('يا سلام على هذا الحماس! زيدوها يا رجال!', 'What energy! Come on, give us more!', 1),
    'cheer_conceded': ('لا تستسلموا! الأمل موجود، ارفعوا رؤوسكم وعودوا للمباراة!', "Don't give up! Heads up, there is still plenty of time to come back!", 1),
    'nice_1': ('ضربة رائعة!', 'What a shot!', 1),
    'nice_2': ('أحسنت! لعب جميل!', 'Well played! Beautiful play!', 1),
    'nice_3': ('مستوى عالٍ! واصل يا بطل!', 'High quality! Keep going, champ!', 1),
    'foul_c': ('العبوا بروح رياضية يا شباب!', 'Keep it clean, play fair, lads!', 0),
    'resume_2': ('هيا نكمل! أرونا مهارتكم!', "Let's go! Show us your skills!", 1),
    'timeout_c': ('التقطوا أنفاسكم، ركّزوا، وعودوا أقوى!', 'Catch your breath, stay focused and come back stronger!', 1),
    'kick_extra': ('هيا يا أبطال! نريد مباراة ممتعة!', "Let's go, champions! Give us a great match!", 1),
    'well_played': ('أداء رائع من الفريقين!', 'Great effort from both teams!', 1),
    'gg': ('مباراة ممتعة! شكرًا لكم يا أبطال، وإلى اللقاء!', 'What a match! Thank you, champions, see you next time!', 1),
}
# --- context-aware + ambient commentary (ar, en, hype) ---
CLIPS.update({
    'in_min': ('فِي الدَّقِيقَة', 'in minute', 1),
    'first_goal': ('', 'The deadlock is broken! The first goal of the match!', 1),
    'equalizer': ('', "It's level! We are right back in this game!", 1),
    'comeback': ('', 'What a comeback! This match has been turned upside down!', 1),
    'takes_lead': ('', 'They take the lead! What a moment!', 1),
    'extends': ('', 'They extend the lead! Total control out there!', 1),
    'pulls_back': ('', 'They pull one back! Hope is alive!', 1),
    'late_goal': ('', 'A goal right at the death! The tension is unbearable!', 1),
    'amb_1': ('', 'Both teams trading attacks! What an exciting match!', 0),
    'amb_2': ('', 'The ball is in midfield and the tempo is high!', 0),
    'amb_3': ('', 'Organised defending and a search for the breakthrough!', 0),
    'amb_4': ('', "What a contest! Don't take your eyes off this one!", 0),
    'amb_5': ('', 'The support from the stands never stops!', 0),
    'amb_6': ('', "The game is heating up, we could see a goal at any moment!", 0),
    'amb_7': ('', 'Great pressing from both sides, nobody is giving an inch!', 0),
})
AR = {
    'first_goal': 'انْفَتَحَ بَابُ التَّسْجِيل! أَوَّلُ هَدَفٍ فِي المُبَارَاة!',
    'equalizer': 'تَعَادَلَ الفَرِيقَان! عَادَتِ المُبَارَاةُ مِنْ جَدِيد!',
    'comeback': 'عَوْدَةٌ مُذْهِلَة! انْقَلَبَتِ المُبَارَاةُ رَأْسًا عَلَى عَقِب!',
    'takes_lead': 'يَتَقَدَّم! يَا لَهَا مِنْ لَحْظَة!',
    'extends': 'يَزِيدُ الفَارِق! سَيْطَرَةٌ تَامَّةٌ فِي المَلْعَب!',
    'pulls_back': 'يُقَلِّصُ الفَارِق! الأَمَلُ يَعُود!',
    'late_goal': 'هَدَفٌ فِي الوَقْتِ القَاتِل! أَعْصَابٌ مَشْدُودَة!',
    'amb_1': 'الفَرِيقَانِ يَتَبَادَلَانِ الهَجَمَات! مُبَارَاةٌ حَمَاسِيَّة!',
    'amb_2': 'الكُرَةُ فِي وَسَطِ المَلْعَب، وَالإِيقَاعُ سَرِيع!',
    'amb_3': 'دِفَاعٌ مُنَظَّمٌ وَمُحَاوَلَاتٌ لِاخْتِرَاقِ الخُطُوط!',
    'amb_4': 'يَا لَهَا مِنْ مُبَارَاةٍ مُثِيرَة! لَا تَرْفَعُوا أَعْيُنَكُم!',
    'amb_5': 'التَّشْجِيعُ مِنَ المُدَرَّجَاتِ لَا يَتَوَقَّف!',
    'amb_6': 'اللَّعِبُ يَزْدَادُ سُخُونَة! قَدْ يَأْتِي الهَدَفُ فِي أَيِّ لَحْظَة!',
    'amb_7': 'ضَغْطٌ رَائِعٌ مِنَ الطَّرَفَيْن، وَلَا أَحَدَ يَتَنَازَلُ عَنْ شِبْر!',
    'goal_1': 'جُوووووول! جُوووووول! مَا شَاءَ الله!',
    'goal_2': 'هَدَف! هَدَف! هَدَفٌ رَائِع! يَا سَلَام!',
    'goal_3': 'جُوووووول! يَا لَهُ مِنْ هَدَفٍ جَمِيل!',
    'goal_4': 'يَا إِلَهِي! جُوووووول!',
    'goal_for': 'لِصَالِحِ',
    'score_is': 'وَأَصْبَحَتِ النَّتِيجَة:',
    'vs': 'مُقَابِل',
    'left': 'المُتَبَقِّي:',
    't1': 'الفَرِيقْ الأَوَّل،', 't2': 'الفَرِيقْ الثَّانِي،',
    'p1': 'اللَّاعِبْ الأَوَّل', 'p2': 'اللَّاعِبْ الثَّانِي',
    'score_fixed': 'تَمَّ تَعْدِيلُ النَّتِيجَة:',
    'foul_on': 'خَطَأٌ عَلَى',
    'foul_ref': 'صَافِرَةُ الحَكَم، خَطَأٌ ضِدَّ',
    'yellow': 'بِطَاقَةٌ صَفْرَاء! إِنْذَارٌ لِأَحَدِ لَاعِبِي',
    'red': 'بِطَاقَةٌ حَمْرَاء! طَرْدٌ مُبَاشِرٌ لِأَحَدِ لَاعِبِي',
    'red_after': 'وَيُكْمِلُ المُبَارَاةَ بِنَقْصٍ عَدَدِي!',
    'kick_off': 'صَافِرَةُ البِدَايَة! انْطَلَقَ',
    'resume': 'اسْتُؤْنِفَ اللَّعِب!',
    'paused': 'تَوَقَّفَ اللَّعِب.',
    'get_ready': 'اسْتَعِدُّوا!',
    'period_0': 'الشَّوْطُ الأَوَّل', 'period_1': 'الشَّوْطُ الثَّانِي',
    'period_2': 'الشَّوْطُ الإِضَافِيُّ الأَوَّل', 'period_3': 'الشَّوْطُ الإِضَافِيُّ الثَّانِي',
    'regular_end': 'انْتَهَى الوَقْتُ الأَصْلِي، وَالحَكَمُ يَحْتَسِبُ وَقْتًا بَدَلَ ضَائِع!',
    'timeout': 'وَقْتٌ مُسْتَقْطَع،',
    'pen2': 'إِيقَافٌ لِمُدَّةِ دَقِيقَتَيْنِ لِأَحَدِ لَاعِبِي',
    'pen_back': 'انْتَهَى الإِيقَاف، وَيَعُودُ اللَّاعِبُ إِلَى المَلْعَبِ فِي',
    'break': 'اسْتِرَاحَةٌ بَيْنَ الشَّوْطَيْنِ. اسْتَعِدُّوا لِلشَّوْطِ الثَّانِي!',
    'half_end': 'انْتَهَى الشَّوْطُ الأَوَّل. وَالنَّتِيجَة:',
    'match_end': 'صَافِرَةُ النِّهَايَة! انْتَهَتِ المُبَارَاة. وَالنَّتِيجَةُ النِّهَائِيَّة:',
    'voice_on': 'المُعَلِّقُ يَعْمَلُ الآن!',
    'scores_point': 'يُسَجِّلُ نُقْطَة.',
    'deuce': 'تَعَادُل! دِيُوس!',
    'adv': 'الأَفْضَلِيَّة',
    'adv_p1': 'الأَفْضَلِيَّةُ لِلَّاعِبِ الأَوَّل!', 'adv_p2': 'الأَفْضَلِيَّةُ لِلَّاعِبِ الثَّانِي!',
    'game_for': 'الشَّوْطُ لِصَالِحِ',
    'games_are': 'وَالأَشْوَاطُ:',
    'tb': 'شَوْطٌ فَاصِل.',
    'tb_start': 'التَّعَادُلُ سِتَّةٌ سِتَّة! نَلْجَأُ إِلَى الشَّوْطِ الفَاصِل!',
    'set_for': 'المَجْمُوعَةُ لِصَالِحِ',
    'match_over': 'انْتَهَتِ المُبَارَاة! الفَائِزُ هُوَ',
    'congrats': 'أَلْفُ مَبْرُوك!',
    'cheer_1': 'اللهُ اللَّه! اسْتَمِرُّوا يَا أَبْطَال!',
    'cheer_2': 'مَا شَاءَ اللهُ عَلَيْكُم! أَدَاءٌ رَائِع!',
    'cheer_3': 'هَكَذَا تَكُونُ كُرَةُ القَدَم! الجُمْهُورُ يُصَفِّق!',
    'cheer_4': 'يَا سَلَامُ عَلَى هَذَا الحَمَاس! زِيدُوهَا يَا رِجَال!',
    'cheer_conceded': 'لَا تَسْتَسْلِمُوا! الأَمَلُ مَوْجُود، ارْفَعُوا رُؤُوسَكُم وَعُودُوا لِلْمُبَارَاة!',
    'nice_1': 'ضَرْبَةٌ رَائِعَة!',
    'nice_2': 'أَحْسَنْت! لَعِبٌ جَمِيل!',
    'nice_3': 'مُسْتَوًى عَالٍ! وَاصِلْ يَا بَطَل!',
    'foul_c': 'العَبُوا بِرُوحٍ رِيَاضِيَّةٍ يَا شَبَاب!',
    'resume_2': 'هَيَّا نُكْمِل! أَرُونَا مَهَارَتَكُم!',
    'timeout_c': 'الْتَقِطُوا أَنْفَاسَكُم، رَكِّزُوا، وَعُودُوا أَقْوَى!',
    'kick_extra': 'هَيَّا يَا أَبْطَال! نُرِيدُ مُبَارَاةً مُمْتِعَة!',
    'well_played': 'أَدَاءٌ رَائِعٌ مِنَ الفَرِيقَيْن!',
    'gg': 'مُبَارَاةٌ مُمْتِعَة! شُكْرًا لَكُم يَا أَبْطَال، وَإِلَى اللِّقَاء!',
}
CLIPS['adv_p1'] = ('', 'Advantage, Player One!', 1)
CLIPS['adv_p2'] = ('', 'Advantage, Player Two!', 1)
for n in range(0, 121):
    CLIPS[f'n{n}'] = (number_ar(n), number_en(n), 0)


async def make(lang, cid, text, hype, sem):
    path = os.path.join(ROOT, lang, cid + '.mp3')
    if os.path.exists(path):
        return
    async with sem:
        rate, pitch = ('+20%', '+5Hz') if hype else ('+8%', '+2Hz')   # lively but clear
        for attempt in range(4):
            try:
                await edge_tts.Communicate(text, VOICES[lang], rate=rate, pitch=pitch, volume='+0%').save(path)
                return
            except Exception:  # network hiccup: retry
                if attempt == 3:
                    raise
                await asyncio.sleep(1.5 * (attempt + 1))


async def main():
    sem = asyncio.Semaphore(6)
    jobs = []
    for lang in VOICES:
        os.makedirs(os.path.join(ROOT, lang), exist_ok=True)
        for cid, (ar, en, hype) in CLIPS.items():
            jobs.append(make(lang, cid, (AR.get(cid) or ar) if lang == 'ar' else en, hype, sem))
    await asyncio.gather(*jobs)
    print(f'{len(CLIPS)} clips x {len(VOICES)} languages in {os.path.normpath(ROOT)}')


if __name__ == '__main__':
    asyncio.run(main())
