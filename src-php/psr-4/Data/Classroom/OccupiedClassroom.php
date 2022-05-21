<?php

namespace FAFL\RecJunioPhp\Data\Classroom;

use FAFL\RecJunioPhp\Data\Group\Group;
use FAFL\RecJunioPhp\Data\User\User;

class OccupiedClassroom extends Classroom
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
    public array $scheduleRowIds,
    public array $groups,
    public array $users,
  )
  {
    parent::__construct($id, $name);
  }
}