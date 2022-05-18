<?php

namespace FAFL\RecJunioPhp\Data\Schedule;

use FAFL\RecJunioPhp\Data\Classroom\ClassroomClassroom;
use FAFL\RecJunioPhp\Data\Group\ScheduleGroup;

class ScheduleInterval
{
  /**
   * @param int $day
   * @param int $hour
   * @param ScheduleGroup[] $groups
   * @param ClassroomClassroom[] $classrooms
   */
  public function __construct(
    public int   $day,
    public int   $hour,
    public array $groups,
    public array $classrooms
  )
  {
  }
}