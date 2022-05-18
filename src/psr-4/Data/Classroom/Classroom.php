<?php

namespace FAFL\RecJunioPhp\Data\Classroom;

class Classroom
{
  /**
   * @param int $id
   * @param string $name
   * @param int[] $scheduleRowIds
   */
  public function __construct(
    public int    $id,
    public string $name,
    public array  $scheduleRowIds,
  )
  {
  }
}