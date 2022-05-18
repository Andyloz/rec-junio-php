<?php

namespace FAFL\RecJunioPhp\Data\Group;

class ScheduleGroup extends Group
{
  /**
   * @param int $id
   * @param string $name
   * @param int[] $scheduleRowIds
   */
  public function __construct(
    int    $id,
    string $name,
    public array  $scheduleRowIds,
  )
  {
    parent::__construct($id, $name);
  }

  public static function buildFromGroup(Group $group, int ...$scheduleRowIds): self
  {
    return new self(
      $group->id,
      $group->name,
      $scheduleRowIds,
    );
  }
}