<?php

namespace FAFL\RecJunioPhp\Data\Schedule;

class ScheduleRow
{
  public function __construct(
    public int $id,
    public int $userId,
    public int $dayId,
    public int $hourId,
    public int $groupId,
    public string $groupName,
    public int $classroomId,
    public string $classroomName,
  )
  {
  }
}