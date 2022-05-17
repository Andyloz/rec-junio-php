<?php

namespace FAFL\RecJunioPhp\Data\Schedule;

class ScheduleInterval
{
  /**
   * @param int $day
   * @param int $hour
   * @param Group[] $groups
   * @param Classroom[] $classrooms
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