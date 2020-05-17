import ClockHelper from '..'
import { WorktimeDayMark, WorktimeDayWorkedTime } from '../../../providers/types';

describe('Date Helper', () => {

  describe('Convert hour string (clock format) in minutes', () => {

    describe('Clocks using the default HH:mm format', () => {
      it('Converts one hour without minutes', () => {
        const minutes = ClockHelper.convertClockStringToMinutes('01:00')
        expect(minutes).toBe(60)
      })

      it('Converts one hour with minutes', () => {
        const minutes = ClockHelper.convertClockStringToMinutes('01:30')
        expect(minutes).toBe(90)
      })

      it('Converts only minutes', () => {
        const minutes = ClockHelper.convertClockStringToMinutes('00:20')
        const minutes2 = ClockHelper.convertClockStringToMinutes('00:59')

        expect(minutes).toBe(20)
        expect(minutes2).toBe(59)
      })
    })

    describe('Humanize minutes to Clock format', () => {

      describe('Clocks using the default HH:mm format', () => {

        it('Humanizes one perfect hour', () => {
          const clock = ClockHelper.humanizeMinutesToClock(60)
          expect(clock).toBe('01:00')
        })

        it('Humanizes one hour and half', () => {
          const clock = ClockHelper.humanizeMinutesToClock(90)
          expect(clock).toBe('01:30')
        })

        it('Humanizes a not zero hour', () => {
          const clock = ClockHelper.humanizeMinutesToClock(1290)
          expect(clock).toBe('21:30')
        })
      })
    })

    describe('Format clock string', () => {
      it('Formats a valid clock string', () => {
        const formattedClock = ClockHelper.formatClockString('1010')
        expect(formattedClock).toBe('10:10')
      })

      it('Displays an error for invalid clock pattern', () => {
        const errorTest = () => ClockHelper.formatClockString('010')
        expect(errorTest).toThrow(Error)
      })
    });

    describe('Calculate interval Of Mark Pairs', () => {
      it('Calulates to perfect default pairs', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '12:00'},
          { clock: '13:00'},
          { clock: '21:00'}
        ]
        const minutes = ClockHelper.calculateBreakMinutes(marks)
        expect(minutes).toBe(60)
      })

      it('Calulates to many pairs', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '12:00'},
          { clock: '13:00'},
          { clock: '21:00'},
          { clock: '22:00'},
          { clock: '23:00'},
        ]
        const minutes = ClockHelper.calculateBreakMinutes(marks)
        expect(minutes).toBe(120)
      })

      it('Calulates to odd marks', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '12:00'},
          { clock: '13:00'}
        ]
        const minutes = ClockHelper.calculateBreakMinutes(marks)
        expect(minutes).toBe(60)
      })

      it('Calulates to odd marks', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '12:00'},
          { clock: '13:00'}
        ]
        const minutes = ClockHelper.calculateBreakMinutes(marks)
        expect(minutes).toBe(60)
      })

      it('Calulates to values less than an hour', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '12:00'},
          { clock: '12:25'},
        ]
        const minutes = ClockHelper.calculateBreakMinutes(marks)
        expect(minutes).toBe(25)
      })
    })

    describe('Calculate worktime', () => {
      beforeEach(() => {
        // moment.mock
      })

      it('Calulates to perfect default pairs', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '12:00'},
          { clock: '13:00'},
          { clock: '18:00'}
        ]
        const worktimeDayResume: WorktimeDayWorkedTime = ClockHelper.calculateWorkedTimeMinutes(marks)
        expect(worktimeDayResume.registeredWorkedMinutes).toBe(60 * 8)
        // expect(worktimeDayResume.workedMinutesUntilNow).toBe(60 * 8)
      })

      it('Calulates to many pairs', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '12:00'}, // +3
          { clock: '13:00'},
          { clock: '21:00'}, // +8
          { clock: '22:00'},
          { clock: '23:00'}, // +1
        ]
        const worktimeDayResume: WorktimeDayWorkedTime = ClockHelper.calculateWorkedTimeMinutes(marks)
        const thirteenHours = 60 * 12
        expect(worktimeDayResume.registeredWorkedMinutes).toBe(thirteenHours)
        // expect(worktimeDayResume.workedMinutesUntilNow).toBe(thirteenHours)
      })

      it('Calulates to odd marks', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '12:00'},
          { clock: '13:00'}
        ]
        const worktimeDayResume: WorktimeDayWorkedTime = ClockHelper.calculateWorkedTimeMinutes(marks)
        const threeHours = 60 * 3
        expect(worktimeDayResume.registeredWorkedMinutes).toBe(threeHours)
        // expect(worktimeDayResume.workedMinutesUntilNow).toBe(threeHours)
      })


      it('Calulates to values less than an hour', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '09:45'}
        ]
        const worktimeDayResume: WorktimeDayWorkedTime = ClockHelper.calculateWorkedTimeMinutes(marks)
        const fortyfiveMinutes = 45
        expect(worktimeDayResume.registeredWorkedMinutes).toBe(fortyfiveMinutes)
        // expect(worktimeDayResume.workedMinutesUntilNow).toBe(fortyfiveMinutes)
      })
    });
  })
});