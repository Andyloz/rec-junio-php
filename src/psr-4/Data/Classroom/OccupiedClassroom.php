<?php

namespace FAFL\RecJunioPhp\Data\Classroom;

class OccupiedClassroom extends ScheduleClassroom
{
  public function __construct(
    int          $id,
    string       $name,
    array        $scheduleRowIds,
    public array $groups,
    public array $users,
  )
  {
    parent::__construct($id, $name, $scheduleRowIds);
  }
}