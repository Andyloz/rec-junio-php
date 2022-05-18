<?php

namespace FAFL\RecJunioPhp\Data\Schedule;

use FAFL\RecJunioPhp\Data\Classroom\ScheduleClassroom;
use FAFL\RecJunioPhp\Data\Group\ScheduleGroup;

class ScheduleInterval
{
  /**
   * @param int $day
   * @param int $hour
   * @param ScheduleGroup[] $groups
   * @param ScheduleClassroom[] $classrooms
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