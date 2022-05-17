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
    for ($day = 1; $day <= 5; $day++) {
      for ($hour = 1; $hour <= 7; $hour++) {
        $this->scheduleRows["d$day"]["h$hour"] = [];
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

        $ids = array_map(fn(ScheduleRow $r) => $r->id, $hourRows);

        $groups = array_map(fn(ScheduleRow $r) => [$r->groupId, $r->groupName], $hourRows);
        $groups = array_unique($groups, SORT_REGULAR);
        $groups = array_map(fn($g) => new Group(...$g), $groups);

        $classrooms = array_map(fn(ScheduleRow $r) => [$r->classroomId, $r->classroomName], $hourRows);
        $classrooms = array_unique($classrooms, SORT_REGULAR);
        $classrooms = array_map(fn($c) => new Classroom(...$c), $classrooms);

        $this->scheduleRows["d$day"]["h$hour"] = new ScheduleInterval(
          $ids,
          $hourRows[0]->day,
          $hourRows[0]->hour,
          $groups,
          $classrooms
        );

      }
    }
  }
}
