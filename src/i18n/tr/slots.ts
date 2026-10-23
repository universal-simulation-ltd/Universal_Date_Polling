// Turkish (tr) — slots. Every key in ../en/slots.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const slots: Draft['slots'] = {
  // The three ways to propose availability
  'view_form': 'Elle gir',
  'view_calendar': 'Takvim',
  'view_days': 'Tam gün',
  'view_none': 'Hiçbiri',

  // Slot lengths, abbreviated
  'duration_m': '{m} dk',
  'duration_h': '{h} sa',
  'duration_hm': '{h} sa {m} dk',

  // Whole days (a month calendar)
  'previous_month': 'Önceki ay',
  'next_month': 'Sonraki ay',
  'no_days_yet': 'Henüz gün yok — önermek istediğiniz günlere tıklayın.',
  'days_selected_one': '{count} gün seçildi',
  'days_selected_other': '{count} gün seçildi',
  'remove_day': '{day} tarihini kaldır',

  // Type in (date + time + length form)
  'date': 'Tarih',
  'time': 'Saat',
  'length': 'Süre',
  'add_time': 'Saat ekle',
  'no_times_yet': 'Henüz saat yok — yukarıdan bir tarih ve saat seçip {button} düğmesine basın.',
  'remove_time': '{day} {time} saatini kaldır',
  'past_moved': 'Geçmişte bir saat seçemezsiniz — {day}, {time} olarak ileri alındı.',
  'dst_gap': 'Dikkat — {zone} diliminde {day} günü {time} diye bir saat yok: o gece saatler ileri alınıyor, bu yüzden bu zaman aralığı {lands} olur.',

  // Calendar (a week grid you drag on)
  'previous_week': 'Önceki hafta',
  'next_week': 'Sonraki hafta',
  'this_week': 'Bu hafta',
  'grid_help': 'Bir güne tıklayarak 1 saatlik bir aralık bırakın ya da süreyi ayarlamak için bir sütunda aşağı sürükleyin. Bir aralığı gün içinde taşımak için sürükleyin; kaldırmak için tıklayın.',
  'busy_legend': 'Çizgili = bağlı takviminizde dolu.',
  'syncing': 'Takviminiz eşitleniyor…',
  'syncing_sr': 'Takviminiz eşitleniyor.',
  'time_passed': 'Bu saat geçti — ileri bir zaman aralığı seçin.',
  'already_proposed': 'Bu saati zaten önerdiniz.',
  'slot_title': '{time} · {length} · taşımak için sürükleyin, kaldırmak için tıklayın',

  // Timezone picker
  'show_times_in': 'Saatlerin gösterileceği dilim',
  'search_zones': 'Saat dilimlerinde ara',
  'search_zones_placeholder': 'Saat dilimi ara…',
  'no_matching_zones': 'Eşleşen saat dilimi yok.',
}

export default slots
