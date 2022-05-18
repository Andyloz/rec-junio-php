<?php

namespace FAFL\RecJunioPhp\Data\Classroom;

class ClassroomClassroom extends Classroom
{
  /**
   * @param int $id
   * @param string $name
   * @param int[] $scheduleRowIds
   */
  public function __construct(
    int          $id,
    string       $name,
    public array $scheduleRowIds,
  )
  {
    parent::__construct($id, $name);
  }
}