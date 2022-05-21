<?php

namespace FAFL\RecJunioPhp\Data\Schedule;

class ScheduleRow
{
  public function __construct(
    public int $id,
    public int $day,
    public int $hour,
    public int $groupId,
    public string $groupName,
    public int $classroomId,
    public string $classroomName,
  )
  {
  }
}