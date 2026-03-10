// =====================
        // AUTO-GENERATE REGULAR TASKS
        // =====================
'use strict';
        let myDayPopupShown = false;
        
        // Хелпер: перевірка чи регулярне завдання заплановане на певний день
        // Публічні свята UA/PL/CZ/RO (фіксовані, без Великодня)
        const PUBLIC_HOLIDAYS = {
            UA: ['01-01','01-07','03-08','05-01','05-02','05-09','06-28','08-24','10-14','12-25','12-26'],
            PL: ['01-01','01-06','05-01','05-03','08-15','11-01','11-11','12-25','12-26'],
            CZ: ['01-01','05-01','05-08','07-05','07-06','09-28','10-28','11-17','12-24','12-25','12-26'],
            RO: ['01-01','01-02','01-24','05-01','05-26','06-05','08-15','11-30','12-01','12-25','12-26'],
        };

        function isPublicHoliday(date, country) {
            const code = (country || 'UA').toUpperCase();
            const holidays = PUBLIC_HOLIDAYS[code] || PUBLIC_HOLIDAYS['UA'];
            const mmdd = (date.getMonth()+1).toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0');
            return holidays.includes(mmdd);
        }

        function isRegularTaskDay(rt, date) {
            const day = date.getDay(); // 0-6
            const dateNum = date.getDate(); // 1-31

            if (rt.period === 'daily') {
                // skip weekends якщо встановлено
                if (rt.skipWeekends && (day === 0 || day === 6)) return false;
                // skip holidays якщо встановлено
                if (rt.skipHolidays && isPublicHoliday(date, rt.holidayCountry)) return false;
                return true;
            }
            
            if (rt.period === 'weekly') {
                if (rt.daysOfWeek && Array.isArray(rt.daysOfWeek)) {
                    return rt.daysOfWeek.includes(day.toString());
                }
                return rt.dayOfWeek === day.toString();
            }
            
            if (rt.period === 'monthly') {
                if (rt.dayOfMonth === 'last') {
                    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                    return dateNum === lastDay;
                }
                return dateNum === parseInt(rt.dayOfMonth);
            }
            
            if (rt.period === 'quarterly') {
                const quarterStartMonth = Math.floor(date.getMonth() / 3) * 3;
                if (date.getMonth() !== quarterStartMonth) return false;
                if (rt.dayOfMonth === 'last') {
                    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                    return dateNum === lastDay;
                }
                return dateNum === parseInt(rt.dayOfMonth);
            }
            
            return false;
        }
