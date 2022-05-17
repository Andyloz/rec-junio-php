<?php

namespace FAFL\RecJunioPhp\Data\Schedule;

class ScheduleInterval
{
  /**
   * @param int[] $ids
   * @param int $day
   * @param int $hour
   * @param Group[] $groups
   * @param Classroom[] $classrooms
   */
  public function __construct(
    public array $ids,
    public int   $day,
    public int   $hour,
    public array $groups,
    public array $classrooms
  )
  {
  }
}