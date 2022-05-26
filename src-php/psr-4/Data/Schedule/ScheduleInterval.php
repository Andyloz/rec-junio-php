<?php

namespace FAFL\RecJunioPhp\Data\Schedule;

use FAFL\RecJunioPhp\Data\Classroom\ScheduleClassroom;
use FAFL\RecJunioPhp\Data\Group\ScheduleGroup;

class ScheduleInterval
{
  /**
   * @param int[] $ids
   * @param int $day
   * @param int $hour
   * @param ScheduleClassroom $classroom
   * @param ScheduleGroup[] $groups
   */
  public function __construct(
    public array             $ids,
    public int               $day,
    public int               $hour,
    public ScheduleClassroom $classroom,
    public array             $groups,
  )
  {
  }
}