<?php

namespace FAFL\RecJunioPhp\Data\Schedule;

class Schedule
{
  /** @var ScheduleInterval[][] */
  public array $scheduleRows;

  /**
   * @param ScheduleRow[] $scheduleRows
   */
  public function __construct(
    array $scheduleRows
  )
  {
    // initialize array
    for ($day = 0; $day <= 5; $day++) {
      for ($hour = 0; $hour <= 7; $hour++) {
        $this->scheduleRows[$day][$hour] = [];
      }
    }

    // order schedule rows by day and hour
    /** @var ScheduleRow[][][] */
    $orderedScheduleRows = [];
    foreach ($scheduleRows as $scheduleRow) {
      $orderedScheduleRows[$scheduleRow->day][$scheduleRow->hour][] = $scheduleRow;
    }

    // construct schedule intervals from rows
    foreach ($orderedScheduleRows as $day => $dayRows) {
      foreach ($dayRows as $hour => $hourRows) {

        $ids = array_map(fn (ScheduleRow $r) => $r->id, $hourRows);
        $groups = array_map(fn (ScheduleRow $r) => new Group($r->groupId, $r->groupName), $hourRows);
        $classrooms = array_map(fn (ScheduleRow $r) => new Classroom($r->classroomId, $r->classroomName), $hourRows);

        $this->scheduleRows[$day][$hour] = new ScheduleInterval(
          $ids,
          $hourRows[0]->userId,
          $hourRows[0]->day,
          $hourRows[0]->hour,
          $groups,
          $classrooms
        );

      }
    }
  }
}