<?php

namespace FAFL\RecJunioPhp\Data\Schedule;

use FAFL\RecJunioPhp\Data\Classroom\ScheduleClassroom;
use FAFL\RecJunioPhp\Data\Group\ScheduleGroup;

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

        // group Groups by id
        /** @var ScheduleGroup[] $groupsById */
        $groupsById = [];
        foreach ($hourRows as $hourRow) {
          if ($groupsById[$hourRow->groupId] ?? false) {
            $groupsById[$hourRow->groupId]->scheduleRowIds[] = $hourRow->id;
          } else {
            $groupsById[$hourRow->groupId] = new ScheduleGroup($hourRow->groupId, $hourRow->groupName, [$hourRow->id]);
          }
        }

        $this->scheduleRows["d$day"]["h$hour"] = new ScheduleInterval(
          $hourRows[0]->day,
          $hourRows[0]->hour,
          array_values($groupsById),
          new ScheduleClassroom($hourRows[0]->classroomId, $hourRows[0]->classroomName, [array_map(fn ($r) => $r->id, $hourRows)])
        );

      }
    }
  }
}
