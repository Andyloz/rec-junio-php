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
   * @return Group[]
   */
  public static function buildGroupsFromScheduleRows(array $rows): array
  {
    // create group rows
    /** @var GroupRow[] $groupRows */
    $groupRows = [];
    foreach ($rows as $row) {
      $groupRows[] = new GroupRow($row->groupId, $row->groupName, $row->id);
    }

    // group group-rows by id
    /** @var GroupRow $groupRowsById */
    $groupRowsById = [];
    foreach ($groupRows as $groupRow) {
      $groupRowsById[$groupRow->id][] = $groupRow;
    }

    // create group objects
    /** @var Group[] $groups */
    $groups = [];
    foreach ($groupRowsById as $groupId => $groupRows) {
      $ids = array_map(fn($gr) => $gr->scheduleRowId, $groupRows);
      $groups[] = new Group(
        $groupId,
        $groupRows[0]->name,
        $ids
      );
    }

    return $groups;
  }

  /**
   * @param ScheduleRow[] $rows
   * @return Classroom[]
   */
  public static function buildClassroomsFromScheduleRows(array $rows): array
  {
    // create classroom rows
    /** @var ClassroomRow[] $classroomRows */
    $classroomRows = [];
    foreach ($rows as $row) {
      $classroomRows[] = new ClassroomRow($row->classroomId, $row->classroomName, $row->id);
    }

    // group classroom-rows by id
    /** @var ClassroomRow $classroomRowsById */
    $classroomRowsById = [];
    foreach ($classroomRows as $classroomRow) {
      $classroomRowsById[$classroomRow->id][] = $classroomRow;
    }

    // create classroom objects
    /** @var Classroom[] $classrooms */
    $classrooms = [];
    foreach ($classroomRowsById as $classroomId => $classroomRows) {
      $ids = array_map(fn($cr) => $cr->scheduleRowId, $classroomRows);
      $classrooms[] = new Classroom(
        $classroomId,
        $classroomRows[0]->name,
        $ids
      );
    }

    return $classrooms;
  }
}
