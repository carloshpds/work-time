import { WorktimeDayMark, WorktimeDayWorkedTime, WorktimeDayResume } from "../../providers/types";

class ClockHelper {
  convertClockStringToMinutes(hourString: string, options = { considerSeconds: false }){
    const formatedHourString = hourString.replace(/:/g, '')
    const hoursAsMinutes = parseInt(formatedHourString.substring(0, 2)) * 60
    const tailMinutes = parseInt(formatedHourString.substring(2))
    return hoursAsMinutes + tailMinutes;
  }

  humanizeMinutesToClock(minutes: number | string, options = { separator: ':' }): string {
    const minutesNumber = typeof minutes === "number" ? minutes : parseInt(minutes, 10)
    const realHoursNumbers = Math.floor(minutesNumber / 60)
    const realMinutes = minutesNumber % 60

    const humanizedHours   = new String(realHoursNumbers).padStart(2, '0')
    const humanizedMinutes = new String(realMinutes).padStart(2, '0')

    return `${humanizedHours}${options.separator}${humanizedMinutes}`;
  }

  formatClockString(clock: string): string {
    if(clock.length !== 4){
      throw new Error('[formatClockString]: Invalid clock format, use: HHmm')
    }

    return [clock.slice(0, 2), ':', clock.slice(2)].join('')
  }

  calculateBreakMinutes(marks: WorktimeDayMark[]) {
    let minutes = 0

    marks.forEach((mark, index) => {
      const isStartingPeriod = index % 2 === 0
      if(index >= 2 && isStartingPeriod){
        const currentMarkInMinutes = this.convertClockStringToMinutes(mark.clock)
        const lastMarkInMinutes = this.convertClockStringToMinutes(marks[index - 1].clock)
        minutes += currentMarkInMinutes - lastMarkInMinutes
      }
      return mark.clock
    })

    return minutes
  }

  calculateWorkedTimeMinutes(marks: WorktimeDayMark[]): WorktimeDayWorkedTime {
    let registeredWorkedMinutes = 0
    let workedMinutesUntilNow = 0
    // let now = moment()

    marks.forEach((mark, index) => {
      const isClosingPeriod = index % 2 === 1
      if(isClosingPeriod){
        const currentMarkInMinutes = this.convertClockStringToMinutes(mark.clock)
        const lastMarkInMinutes = this.convertClockStringToMinutes(marks[index - 1].clock)
        registeredWorkedMinutes += currentMarkInMinutes - lastMarkInMinutes
      }
      return mark.clock
    })

    return { registeredWorkedMinutes, workedMinutesUntilNow }
  }

  calculateWorktimeDayResume(marks: WorktimeDayMark[]): WorktimeDayResume {
    const worktimeDayResume: WorktimeDayResume = {
      registeredWorkedMinutes: 0,
      workedMinutesUntilNow: 0,
      breakMinutes: 0,
      shouldLeaveClockTime: 'Invalid'
    }

    return worktimeDayResume
  }
}

export default new ClockHelper()