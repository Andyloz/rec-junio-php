<?php

namespace FAFL\RecJunioPhp\Data\Classroom;

use FAFL\RecJunioPhp\Data\Group\Group;
use FAFL\RecJunioPhp\Data\User\User;

class OccupiedClassroom extends ScheduleClassroom
{
  /**
   * @param int $id
   * @param string $name
   * @param int[] $scheduleRowIds
   * @param Group[] $groups
   * @param User[] $users
   */
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