-- ─────────────────────────────────────────
--  KIT Forum — Speakers country normalization
-- ─────────────────────────────────────────
--  Run this in Supabase SQL editor.
--
--  Цель:
--    · Если в `country_flag` лежит ISO-код (например "uz", "kg"),
--      превратить его в эмодзи и подтянуть локализованное имя
--      страны в `country` (ru/ky/en).
--    · Все исходные эмодзи остаются как были.
--    · В конце опционально включаем CHECK, чтобы поле не было пустым.
--
--  Список покрывает основные страны, использующиеся в админке.
--  Если в БД попадётся незнакомый ISO-код — строка останется как есть,
--  её надо будет пересохранить из админки.

create or replace function _kit_norm_speaker_country() returns void
language plpgsql as $$
declare
  m record;
begin
  for m in
    select * from (values
      ('kg','🇰🇬','Кыргызстан','Кыргызстан','Kyrgyzstan'),
      ('kz','🇰🇿','Казахстан','Казакстан','Kazakhstan'),
      ('uz','🇺🇿','Узбекистан','Өзбекстан','Uzbekistan'),
      ('tj','🇹🇯','Таджикистан','Тажикстан','Tajikistan'),
      ('tm','🇹🇲','Туркменистан','Түркмөнстан','Turkmenistan'),
      ('ru','🇷🇺','Россия','Орусия','Russia'),
      ('by','🇧🇾','Беларусь','Беларусь','Belarus'),
      ('ua','🇺🇦','Украина','Украина','Ukraine'),
      ('md','🇲🇩','Молдова','Молдова','Moldova'),
      ('ge','🇬🇪','Грузия','Грузия','Georgia'),
      ('am','🇦🇲','Армения','Армения','Armenia'),
      ('az','🇦🇿','Азербайджан','Азербайжан','Azerbaijan'),
      ('us','🇺🇸','США','АКШ','United States'),
      ('ca','🇨🇦','Канада','Канада','Canada'),
      ('mx','🇲🇽','Мексика','Мексика','Mexico'),
      ('br','🇧🇷','Бразилия','Бразилия','Brazil'),
      ('ar','🇦🇷','Аргентина','Аргентина','Argentina'),
      ('gb','🇬🇧','Великобритания','Улуу Британия','United Kingdom'),
      ('ie','🇮🇪','Ирландия','Ирландия','Ireland'),
      ('de','🇩🇪','Германия','Германия','Germany'),
      ('fr','🇫🇷','Франция','Франция','France'),
      ('es','🇪🇸','Испания','Испания','Spain'),
      ('it','🇮🇹','Италия','Италия','Italy'),
      ('pt','🇵🇹','Португалия','Португалия','Portugal'),
      ('nl','🇳🇱','Нидерланды','Нидерланд','Netherlands'),
      ('be','🇧🇪','Бельгия','Бельгия','Belgium'),
      ('ch','🇨🇭','Швейцария','Швейцария','Switzerland'),
      ('at','🇦🇹','Австрия','Австрия','Austria'),
      ('pl','🇵🇱','Польша','Польша','Poland'),
      ('cz','🇨🇿','Чехия','Чехия','Czechia'),
      ('hu','🇭🇺','Венгрия','Венгрия','Hungary'),
      ('ro','🇷🇴','Румыния','Румыния','Romania'),
      ('bg','🇧🇬','Болгария','Болгария','Bulgaria'),
      ('rs','🇷🇸','Сербия','Сербия','Serbia'),
      ('gr','🇬🇷','Греция','Греция','Greece'),
      ('se','🇸🇪','Швеция','Швеция','Sweden'),
      ('no','🇳🇴','Норвегия','Норвегия','Norway'),
      ('fi','🇫🇮','Финляндия','Финляндия','Finland'),
      ('dk','🇩🇰','Дания','Дания','Denmark'),
      ('is','🇮🇸','Исландия','Исландия','Iceland'),
      ('ee','🇪🇪','Эстония','Эстония','Estonia'),
      ('lv','🇱🇻','Латвия','Латвия','Latvia'),
      ('lt','🇱🇹','Литва','Литва','Lithuania'),
      ('tr','🇹🇷','Турция','Түркия','Türkiye'),
      ('il','🇮🇱','Израиль','Израиль','Israel'),
      ('sa','🇸🇦','Саудовская Аравия','Сауд Арабиясы','Saudi Arabia'),
      ('ae','🇦🇪','ОАЭ','БАЭ','United Arab Emirates'),
      ('qa','🇶🇦','Катар','Катар','Qatar'),
      ('jo','🇯🇴','Иордания','Иордания','Jordan'),
      ('lb','🇱🇧','Ливан','Ливан','Lebanon'),
      ('ir','🇮🇷','Иран','Иран','Iran'),
      ('af','🇦🇫','Афганистан','Ооганстан','Afghanistan'),
      ('pk','🇵🇰','Пакистан','Пакистан','Pakistan'),
      ('in','🇮🇳','Индия','Индия','India'),
      ('bd','🇧🇩','Бангладеш','Бангладеш','Bangladesh'),
      ('mn','🇲🇳','Монголия','Монголия','Mongolia'),
      ('cn','🇨🇳','Китай','Кытай','China'),
      ('hk','🇭🇰','Гонконг','Гонконг','Hong Kong'),
      ('tw','🇹🇼','Тайвань','Тайвань','Taiwan'),
      ('jp','🇯🇵','Япония','Япония','Japan'),
      ('kr','🇰🇷','Южная Корея','Түштүк Корея','South Korea'),
      ('vn','🇻🇳','Вьетнам','Вьетнам','Vietnam'),
      ('th','🇹🇭','Таиланд','Таиланд','Thailand'),
      ('my','🇲🇾','Малайзия','Малайзия','Malaysia'),
      ('sg','🇸🇬','Сингапур','Сингапур','Singapore'),
      ('id','🇮🇩','Индонезия','Индонезия','Indonesia'),
      ('ph','🇵🇭','Филиппины','Филиппиндер','Philippines'),
      ('au','🇦🇺','Австралия','Австралия','Australia'),
      ('nz','🇳🇿','Новая Зеландия','Жаңы Зеландия','New Zealand'),
      ('eg','🇪🇬','Египет','Египет','Egypt'),
      ('ma','🇲🇦','Марокко','Марокко','Morocco'),
      ('ng','🇳🇬','Нигерия','Нигерия','Nigeria'),
      ('za','🇿🇦','ЮАР','ТАР','South Africa'),
      ('ke','🇰🇪','Кения','Кения','Kenya')
    ) as t(code, flag, ru, ky, en)
  loop
    update speakers
       set country_flag = m.flag,
           country      = jsonb_build_object('ru', m.ru, 'ky', m.ky, 'en', m.en)
     where lower(country_flag) = m.code;
  end loop;
end $$;

select _kit_norm_speaker_country();
drop function _kit_norm_speaker_country();

-- ─── Constraint: country_flag must not be empty ────
alter table speakers
  drop constraint if exists speakers_country_flag_nonempty;
alter table speakers
  add constraint speakers_country_flag_nonempty
  check (length(country_flag) > 0);

-- Проверь после прогона:
--   select id, country_flag, country->>'ru' as ru
--     from speakers
--    order by order_index;
