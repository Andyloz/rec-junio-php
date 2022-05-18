<?php

namespace FAFL\RecJunioPhp\Data\Schedule;

use FAFL\RecJunioPhp\Data\Classroom\ScheduleClassroom;
use FAFL\RecJunioPhp\Data\Classroom\ScheduleClassroomRow;
use FAFL\RecJunioPhp\Data\Group\ScheduleGroup;
use FAFL\RecJunioPhp\Data\Group\ScheduleGroupRow;

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
        $groups = self::buildGroupsFromScheduleRows($hourRows);
        $classrooms = self::buildClassroomsFromScheduleRows($hourRows);

        $this->scheduleRows["d$day"]["h$hour"] = new ScheduleInterval(
          $hourRows[0]->day,
          $hourRows[0]->hour,
          $groups,
          $classrooms
        );

      }
    }
  }

  /**
   * @param ScheduleRow[] $rows
   * @return ScheduleGroup[]
   */
  public static function buildGroupsFromScheduleRows(array $rows): array
  {
    // create group rows
    /** @var ScheduleGroupRow[] $groupRows */
    $groupRows = [];
    foreach ($rows as $row) {
      $groupRows[] = new ScheduleGroupRow($row->groupId, $row->groupName, $row->id);
    }

    // group group-rows by id
    /** @var ScheduleGroupRow $groupRowsById */
    $groupRowsById = [];
    foreach ($groupRows as $groupRow) {
      $groupRowsById[$groupRow->id][] = $groupRow;
    }

    // create group objects
    /** @var ScheduleGroup[] $groups */
    $groups = [];
    foreach ($groupRowsById as $groupId => $groupRows) {
      $ids = array_map(fn($gr) => $gr->scheduleRowId, $groupRows);
      $groups[] = new ScheduleGroup(
        $groupId,
        $groupRows[0]->name,
        $ids
      );
    }

    return $groups;
  }

  /**
   * @param ScheduleRow[] $rows
   * @return ScheduleClassroom[]
   */
  public static function buildClassroomsFromScheduleRows(array $rows): array
  {
    // create classroom rows
    /** @var ScheduleClassroomRow[] $classroomRows */
    $classroomRows = [];
    foreach ($rows as $row) {
      $classroomRows[] = new ScheduleClassroomRow($row->classroomId, $row->classroomName, $row->id);
    }

    // group classroom-rows by id
    /** @var ScheduleClassroomRow $classroomRowsById */
    $classroomRowsById = [];
    foreach ($classroomRows as $classroomRow) {
      $classroomRowsById[$classroomRow->id][] = $classroomRow;
    }

    // create classroom objects
    /** @var ScheduleClassroom[] $classrooms */
    $classrooms = [];
    foreach ($classroomRowsById as $classroomId => $classroomRows) {
      $ids = array_map(fn($cr) => $cr->scheduleRowId, $classroomRows);
      $classrooms[] = new ScheduleClassroom(
        $classroomId,
        $classroomRows[0]->name,
        $ids
      );
    }

    return $classrooms;
  }
}
