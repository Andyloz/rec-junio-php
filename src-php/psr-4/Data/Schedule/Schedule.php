<?php

namespace FAFL\RecJunioPhp\Data\Schedule;

use stdClass;

class Schedule
{
  public stdClass $scheduleRows;

  /**
   * @param ScheduleInterval[] $scheduleIntervals
   */
  public function __construct(
    array $scheduleIntervals
  )
  {
    $this->scheduleRows = new stdClass();

    // initialize array
    for ($day = 1; $day <= 5; $day++) {
      $this->scheduleRows->{$day} = new stdClass();
      for ($hour = 1; $hour <= 7; $hour++) {
        $this->scheduleRows->{$day}->{$hour} = new stdClass();
      }
    }

    foreach ($scheduleIntervals as $i) {
      $this->scheduleRows->{$i->day}->{$i->hour} = $i;
    }
  }
}
