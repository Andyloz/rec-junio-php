<?php

namespace FAFL\RecJunioPhp\Data\Schedule;

class GroupRow
{
  /**
   * @param int $id
   * @param string $name
   * @param int $scheduleRowId
   */
  public function __construct(
    public int    $id,
    public string $name,
    public int    $scheduleRowId,
  )
  {
  }
}