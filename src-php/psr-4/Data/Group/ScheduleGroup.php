<?php

namespace FAFL\RecJunioPhp\Data\Group;

class ScheduleGroup extends Group
{
  /**
   * @param int $id
   * @param string $name
   * @param int $scheduleRowId
   */
  public function __construct(
    int        $id,
    string     $name,
    public int $scheduleRowId,
  )
  {
    parent::__construct($id, $name);
  }
}